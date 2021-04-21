import React, {useCallback, useEffect, useState} from 'react';
import {kmeans} from '../kmeans';
import {Button, TextField} from '@material-ui/core';
import Plot from 'react-plotly.js';
import Loading, {LOADING_TYPES} from './Loading';
import ClusterGroup from './ClusterGroup';
import {getWeekDayAndHourAverages, groupBy} from '../utils';

const DEFAULT_K = 3;

const KMeansLayout = (data) => {

    const [clusters, setClusters] = useState([]);
    const [k, setK] = useState(DEFAULT_K);
    const [plotlyChartData, setPlotlyChartData] = useState([]);
    const [areClustersBeingCalculated, setAreClustersBeingCalculated] = useState(false);

    const handleCalculateClick = useCallback(() => {
        setAreClustersBeingCalculated(true)
    }, [setAreClustersBeingCalculated]);

    const changeKHandler = useCallback((event) => {
        if (event.target.value > 0) {
            setK(Number(event.target.value));
        }
    }, [setK])

    useEffect(() => {
        if (areClustersBeingCalculated) {
            const preparedData = getWeekDayAndHourAverages(data);
            let arrayOfClusters = kmeans(preparedData, k);
            for (let i = 0; i < 30; i++) {
                let hasCorrectNumberOfClusters = true;
                for (const cluster of arrayOfClusters) {
                    if (!cluster.length) {
                        hasCorrectNumberOfClusters = false;
                    }
                }
                if (hasCorrectNumberOfClusters) {
                    break;
                }
                arrayOfClusters = kmeans(preparedData, k);
            }
            setClusters(arrayOfClusters);

            const chartData = [];
            let i = 1;
            for (const cluster of arrayOfClusters) {
                const chartItem = {
                    x: [],
                    y: [],
                    z: [],
                    text: [],
                    hovertemplate: '<b>%{text}</b>',
                    type: 'scatter3d',
                    mode: 'markers',
                    name: `Cluster ${i}`
                };
                for (const item of cluster) {
                    chartItem.x.push(item.day);
                    chartItem.y.push(item.hour);
                    chartItem.z.push(item.average);
                    chartItem.text.push(`${item.day} ${item.hour}:00 - ${Math.round(item.average)} mW in average`);
                }
                chartData.push(chartItem);
                i++;
            }

            const groupedItems = groupBy(preparedData, 'day');

            for (const key in groupedItems) {
                let itemsByDay = groupedItems[key];
                itemsByDay.sort((a, b) => (a.hour > b.hour) ? 1 : -1);

                const dayItem = {
                    x: [],
                    y: [],
                    z: [],
                    type: 'scatter3d',
                    mode: 'lines',
                    opacity: 1,
                    showlegend: false,
                    hoverinfo: 'none',
                    line: {
                        width: 4,
                        color: 'rgb(75, 75, 75)',
                        reversescale: false
                    },
                    name: `Day`
                };

                for (const item of itemsByDay) {
                    dayItem.x.push(item.day);
                    dayItem.y.push(item.hour);
                    dayItem.z.push(item.average);
                }
                chartData.push(dayItem);
            }

            setPlotlyChartData(chartData);
            setAreClustersBeingCalculated(false);
        }
    }, [areClustersBeingCalculated, setPlotlyChartData, setAreClustersBeingCalculated, setClusters, data, k])

    return <>
        <div>
            <TextField id={'k'} helperText={'k value for k-means'} type={'number'} aria-valuemin={'1'} value={k} onChange={changeKHandler}/>
            <Button variant={"contained"} disabled={areClustersBeingCalculated} color={"primary"} onClick={handleCalculateClick}>
                Calculate
            </Button>
        </div>
        {areClustersBeingCalculated ? <Loading type={LOADING_TYPES.circular}/> : null}
        {!areClustersBeingCalculated && plotlyChartData.length ? <Plot
            data={plotlyChartData}
            layout={{
                width: 960,
                height: 750,
                title: 'K-Means',
                scene: {
                    xaxis: {
                        title: {
                            size: 18,
                            text: 'Day'
                        }
                    },
                    yaxis: {
                        title: {
                            size: 18,
                            text: 'Hour'
                        }
                    },
                    zaxis: {
                        title: {
                            size: 18,
                            text: 'Power'
                        }
                    }
                }
            }}
        /> : null}
        {clusters.length ? <h2>Groups of hours by week day with similar power consumption</h2> : null}
        {clusters.map((cluster, i) => {
            return <ClusterGroup heading={`Cluster ${i + 1}`} key={i}>
                <div key={0} className={'clusterGroupLine --heading'}>
                    <span className={'clusterGroupLine__day'}>Day</span>
                    <span className={'clusterGroupLine__hour'}>Hour</span>
                    <span className={'clusterGroupLine__average'}>Average consumption</span>
                </div>
                {cluster.map((item, j) => {
                    return <div key={j + 1} className={'clusterGroupLine'}>
                        <span className={'clusterGroupLine__day'}>{item.day}</span>
                        <span className={'clusterGroupLine__hour'}>{item.hour}:00</span>
                        <span className={'clusterGroupLine__average'}>{Math.round(item.average)} mW</span>
                    </div>;
                })}
            </ClusterGroup>;
        })}
    </>
};

export default KMeansLayout;
