import React, {useMemo} from 'react';
import UsagePieChart from './UsagePieChart';
import {customDateFormatter, DAILY_CHART_TYPES, DAY_MAPPING, getDailyAverages, getDailyMedians, getDailyPeaks, getLongestUptimeAndDowntime, getUsagePercentage} from '../utils';
import DailyChart from './DailyChart';

const StatisticsLayout = (props) => {
    const {data} = props;

    const usagePercentageData = useMemo(() => {
        return getUsagePercentage(data);
    }, [data]);

    const dailyMedianData = useMemo(() => {
        return getDailyMedians(data);
    }, [data])

    const dailyAverageData = useMemo(() => {
        return getDailyAverages(data);
    }, [data])

    const dailyPeaksData = useMemo(() => {
        return getDailyPeaks(data);
    }, [data])

    const uptimeData = useMemo(() => {
        return getLongestUptimeAndDowntime(data);
    }, [data]);

    return <div className={'statisticsLayout'}>
        <UsagePieChart chartData={usagePercentageData}/>
        <div className={'operationalTime'}>
            <div className={'operationalTime__record --down'}><span>Longest downtime</span> {customDateFormatter(uptimeData.downtimeFrom)} – {customDateFormatter(uptimeData.downtimeTo)}</div>
            <div className={'operationalTime__record --up'}><span>Longest uptime</span> {customDateFormatter(uptimeData.uptimeFrom)} – {customDateFormatter(uptimeData.uptimeTo)}</div>
        </div>
        <DailyChart chartData={dailyMedianData} title={'Non-zero daily power median'} type={DAILY_CHART_TYPES.Bar}/>
        <DailyChart chartData={dailyAverageData} title={'Daily power average'} type={DAILY_CHART_TYPES.Bar}/>
        <DailyChart
            chartData={dailyPeaksData}
            title={'Daily power peaks'}
            type={DAILY_CHART_TYPES.Bar}
            tickFormatter={(value) => DAY_MAPPING[((new Date(value)).getDay())].substring(0, 2)}
            labelFormatter={(value) => (new Date(value)).toLocaleString(undefined, {
                month: 'long', day: 'numeric', minute: 'numeric', hour: 'numeric'
            })}
        />
    </div>;
};

export default StatisticsLayout;
