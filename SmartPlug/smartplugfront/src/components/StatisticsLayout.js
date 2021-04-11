import React, {useMemo} from 'react';
import UsagePieChart from './UsagePieChart';
import {customDateFormatter, DAILY_CHART_TYPES, getDailyAverages, getDailyMedians, getDailyPeaks, getLongestUptimeAndDowntime, getUsagePercentage} from '../utils';
import DailyChart from './DailyChart';
import DailyPeaksChart from './DailyPeaksChart';

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
    
    console.log(uptimeData);

    return <div className={'statisticsLayout'}>
        <UsagePieChart chartData={usagePercentageData}/>
        <div className={'operationalTime'}>
            <div className={'operationalTime__record --down'}><span>Longest downtime</span> {customDateFormatter(uptimeData.downtimeFrom)} – {customDateFormatter(uptimeData.downtimeTo)}</div>
            <div className={'operationalTime__record --up'}><span>Longest uptime</span> {customDateFormatter(uptimeData.uptimeFrom)} – {customDateFormatter(uptimeData.uptimeTo)}</div>
        </div>
        <DailyChart chartData={dailyMedianData} title={'Non-zero consumption median'} type={DAILY_CHART_TYPES.Line}/>
        <DailyChart chartData={dailyAverageData} title={'Daily average'} type={DAILY_CHART_TYPES.Line}/>
        <DailyPeaksChart chartData={dailyPeaksData}/>
    </div>;
};

export default StatisticsLayout;
