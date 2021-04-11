import React from 'react';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {array} from 'prop-types';
import {amber, purple, red} from '@material-ui/core/colors';

const GeneralLineChart = (props) => {
    const {chartData, current, power, voltage} = props;

    return <div className={'rechartsContainer'}>
        <ResponsiveContainer>
            <LineChart width={730} height={250} data={chartData}>
                <CartesianGrid strokeDasharray={'3 3'}/>
                <XAxis dataKey={'createdAt'} minTickGap={15} tickFormatter={(value) => (new Date(value)).toLocaleString(undefined, {
                    month: 'numeric', day: 'numeric',
                })}/>
                <YAxis yAxisId={'1'} hide={true}/>
                <YAxis yAxisId={'2'} hide={true}/>
                <YAxis yAxisId={'3'} hide={true}/>
                <Tooltip labelFormatter={(value) => (new Date(value)).toLocaleString(undefined, {
                    month: 'long', day: 'numeric', minute: 'numeric', hour: 'numeric'
                })}/>
                <Legend/>
                {voltage ? <Line
                    unit={' mV'}
                    name={'Voltage'}
                    animationDuration={0}
                    strokeWidth={2}
                    yAxisId={'1'}
                    type={'monotone'}
                    dataKey={'voltage'}
                    stroke={amber[600]}
                    dot={false}
                /> : null}
                {current ? <Line unit={' mA'}
                                 name={'Current'}
                                 animationDuration={0}
                                 strokeWidth={2}
                                 yAxisId={'2'}
                                 type={'monotone'}
                                 dataKey={'current'}
                                 stroke={red[600]}
                                 dot={false}
                /> : null}
                {power ? <Line unit={' mW'}
                               name={'Power'}
                               animationDuration={0}
                               strokeWidth={2}
                               yAxisId={'3'}
                               type={'monotone'}
                               dataKey={'power'}
                               stroke={purple[600]}
                               dot={false}
                /> : null}
            </LineChart>
        </ResponsiveContainer>
    </div>;
}

GeneralLineChart.propTypes = {
    chartData: array.isRequired
}

export default GeneralLineChart;
