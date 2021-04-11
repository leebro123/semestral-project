import React, {useCallback, useEffect, useState} from 'react';
import {Button, TextField} from '@material-ui/core';
import {getWeekDayAndHourAverages, groupBy} from '../utils';
import Loading, {LOADING_TYPES} from './Loading';
import Plot from 'react-plotly.js';
import ClusterGroup from './ClusterGroup';
import {runDBSCAN} from '../dbscan';

const DEFAULT_EPSILON = 250;
const DEFAULT_MIN_PTS = 5;

const DBSCANLayout = (data) => {

    const [clusters, setClusters] = useState([]);
    const [noise, setNoise] = useState([]);
    const [epsilon, setEpsilon] = useState(DEFAULT_EPSILON);
    const [minPts, setMinPts] = useState(DEFAULT_MIN_PTS);
    const [plotlyChartData, setPlotlyChartData] = useState([]);
    const [areClustersBeingCalculated, setAreClustersBeingCalculated] = useState(false);

    const handleCalculateClick = useCallback(() => {
        setAreClustersBeingCalculated(true)
    }, [setAreClustersBeingCalculated]);

    const changeEpsilonHandler = useCallback((event) => {
        if (event.target.value > 0) {
            setEpsilon(Number(event.target.value));
        }
    }, [setEpsilon])

    const changeMinPtsHandler = useCallback((event) => {
        if (event.target.value > 0) {
            setMinPts(Number(event.target.value));
        }
    }, [setMinPts])

    useEffect(() => {
        if (areClustersBeingCalculated) {
            const preparedData = getWeekDayAndHourAverages(data);
            const result = runDBSCAN(preparedData, epsilon, minPts);

            setClusters(result.clusters);
            setNoise(result.noise);

            const chartData = [];
            let i = 1;
            for (const cluster of result.clusters) {
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

            const noiseItem = {
                x: [],
                y: [],
                z: [],
                text: [],
                hovertemplate: '<b>%{text}</b>',
                type: 'scatter3d',
                mode: 'markers',
                marker: {
                    color: 'rgb(150, 150, 150)'
                },
                name: `Noise`
            };
            for (const item of result.noise) {
                noiseItem.x.push(item.day);
                noiseItem.y.push(item.hour);
                noiseItem.z.push(item.average);
                noiseItem.text.push(`${item.day} ${item.hour}:00 - ${Math.round(item.average)} mW in average`);
            }
            chartData.push(noiseItem);

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
    }, [areClustersBeingCalculated, setPlotlyChartData, setAreClustersBeingCalculated, setClusters, data, epsilon, minPts, setNoise])

    return <>
        <div>
            <TextField id={'epsilon'} helperText={'ε'} type={'number'} aria-valuemin={'1'} value={epsilon} onChange={changeEpsilonHandler}/>
            <TextField id={'minPts'} helperText={'Minimum points per cluster'} type={'number'} aria-valuemin={'1'} value={minPts} onChange={changeMinPtsHandler}/>
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
                title: 'DBSCAN',
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
        {noise.length ? <ClusterGroup heading={`Noise`}>
            <div key={0} className={'clusterGroupLine --heading'}>
                <span className={'clusterGroupLine__day'}>Day</span>
                <span className={'clusterGroupLine__hour'}>Hour</span>
                <span className={'clusterGroupLine__average'}>Average consumption</span>
            </div>
            {noise.map((item, j) => {
                return <div key={j + 1} className={'clusterGroupLine'}>
                    <span className={'clusterGroupLine__day'}>{item.day}</span>
                    <span className={'clusterGroupLine__hour'}>{item.hour}:00</span>
                    <span className={'clusterGroupLine__average'}>{Math.round(item.average)} mW</span>
                </div>;
            })}
        </ClusterGroup> : null}
    </>;
};

export default DBSCANLayout;
