import React, {useCallback} from 'react';
import {Cell, Pie, ResponsiveContainer, PieChart, Legend} from 'recharts';

const COLORS = ['#4caf50', '#f44336'];

const UsagePieChart = (props) => {
    const {chartData} = props;

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = useCallback(({cx, cy, midAngle, innerRadius, outerRadius, percent, index}) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${((percent * 100).toFixed(0))}%`}
            </text>
        );
    }, [RADIAN]);

    return <div className={'rechartsContainer --small'}>
        <h3 style={{margin: 0}}>Operational time</h3>
        <ResponsiveContainer>
            <PieChart>
                <Legend/>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    </div>;
};

export default UsagePieChart;
