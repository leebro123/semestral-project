import React, {useMemo} from 'react';
import {Bar, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis, BarChart, Tooltip} from 'recharts';
import {purple} from '@material-ui/core/colors';
import {array, func, oneOf, string} from 'prop-types';
import {DAILY_CHART_TYPES} from '../utils';

const DailyChart = (props) => {

    const {chartData, title, type, labelFormatter, tickFormatter} = props;

    const chart = useMemo(() => {
        if (type === DAILY_CHART_TYPES.Line) {
            return <LineChart width={730} height={250} data={chartData}>
                <CartesianGrid/>
                <XAxis dataKey={'day'} tickFormatter={tickFormatter}/>
                <YAxis domain={['dataMin - 10', 'auto']}/>
                <Legend/>
                <Tooltip labelFormatter={labelFormatter}/>
                <Line
                    unit={'mW'}
                    name={'Power [mW]'}
                    strokeWidth={2}
                    type={'monotone'}
                    dataKey={'value'}
                    stroke={purple[600]}
                    dot={true}
                />
            </LineChart>;
        }
        if (type === DAILY_CHART_TYPES.Bar) {
            return <BarChart height={250} data={chartData}>
                <CartesianGrid/>
                <XAxis dataKey={'day'} tickFormatter={tickFormatter}/>
                <YAxis domain={['dataMin - 10', 'auto']}/>
                <Legend/>
                <Tooltip allowEscapeViewBox={{x: true, y: true}} labelFormatter={labelFormatter}/>
                <Bar
                    unit={'mW'}
                    name={'Power [mW]'}
                    dataKey={'value'}
                    barSize={16}
                    fill={purple[600]}
                />
            </BarChart>;
        }
    }, [chartData, labelFormatter, tickFormatter, type]);

    return <div className={'rechartsContainer --small'}>
        {title ? <h3>{title}</h3> : null}
        <ResponsiveContainer>
            {chart}
        </ResponsiveContainer>
    </div>;
};

DailyChart.propTypes = {
    chartData: array.isRequired,
    title: string,
    type: oneOf(Object.values(DAILY_CHART_TYPES)),
    tickFormatter: func,
    labelFormatter: func
};

DailyChart.defaultProps = {
    tickFormatter: (value) => value.substring(0, 2),
};

export default DailyChart;



