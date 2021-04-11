import React from 'react';
import {Bar, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, BarChart, Tooltip} from 'recharts';
import {purple} from '@material-ui/core/colors';
import {array, oneOf, string} from 'prop-types';
import {DAILY_CHART_TYPES, DAY_MAPPING} from '../utils';

const DailyPeaksChart = (props) => {
    const {chartData} = props;

    return <div className={'rechartsContainer --small'}>
        <h3>Daily peaks</h3>
        <ResponsiveContainer>
            <BarChart height={250} data={chartData}>
                <CartesianGrid/>
                <XAxis dataKey={'day'} tickFormatter={(value) => DAY_MAPPING[((new Date(value)).getDay())].substring(0, 2)}/>
                <YAxis domain={['dataMin - 10', 'auto']}/>
                <Legend/>
                <Tooltip labelFormatter={(value) => (new Date(value)).toLocaleString(undefined, {
                    month: 'long', day: 'numeric', minute: 'numeric', hour: 'numeric'
                })}/>
                <Bar
                    unit={'mW'}
                    name={'Power [mW]'}
                    dataKey={'value'}
                    barSize={16}
                    fill={purple[600]}
                />
            </BarChart>
        </ResponsiveContainer>
    </div>;
};

DailyPeaksChart.propTypes = {
    chartData: array.isRequired,
    title: string,
    type: oneOf(Object.values(DAILY_CHART_TYPES))
};

export default DailyPeaksChart;



