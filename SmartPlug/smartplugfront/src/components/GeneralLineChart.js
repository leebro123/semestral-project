import React from 'react';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {array} from 'prop-types';

const GeneralLineChart = (props) => {
    const {chartData} = props;

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
                <Line
                    unit={' mV'}
                    name={'Voltage'}
                    animationDuration={0}
                    strokeWidth={2}
                    yAxisId={'1'}
                    type={'monotone'}
                    dataKey={'voltage'}
                    stroke={'#ffc107'}
                    dot={false}
                />
                <Line unit={' mA'}
                      name={'Current'}
                      animationDuration={0}
                      strokeWidth={2}
                      yAxisId={'2'}
                      type={'monotone'}
                      dataKey={'current'}
                      stroke={'#f44336'}
                      dot={false}
                />
                <Line unit={' mW'}
                      name={'Power'}
                      animationDuration={0}
                      strokeWidth={2}
                      yAxisId={'3'}
                      type={'monotone'}
                      dataKey={'power'}
                      stroke={'#673ab7'}
                      dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>;
}

GeneralLineChart.propTypes = {
    chartData: array.isRequired
}

export default GeneralLineChart;
