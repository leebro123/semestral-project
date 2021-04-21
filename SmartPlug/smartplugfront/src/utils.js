export const DAY_MAPPING = {
    0: 'Monday',
    1: 'Tuesday',
    2: 'Wednesday',
    3: 'Thursday',
    4: 'Friday',
    5: 'Saturday',
    6: 'Sunday',
};

export const DAY_ORDER = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

export const DAILY_CHART_TYPES = {
    Line: 'line',
    Bar: 'bar'
}

export const getWeekDayAndHourAverages = (data) => {
    const result = {};

    for (const measurement of data) {
        const createdAt = new Date(measurement.createdAt);
        const day = DAY_MAPPING[createdAt.getDay()];
        const hour = createdAt.getHours();
        const key = `${day}${hour}`;

        if (!result.hasOwnProperty(key)) {
            result[key] = {count: 0, total: 0, key, day, hour}
        }
        result[key].total += measurement.power;
        result[key].count++;
    }

    for (const key of Object.keys(result)) {
        const measurement = result[key];
        result[key].average = measurement.total / measurement.count;
    }

    return Object.keys(result).map((key) => result[key]);
}

export const getUsagePercentage = (data) => {
    const result = {onPercentage: 0, offPercentage: 0};

    let onCount = 0;
    let offCount = 0;

    for (const measurement of data) {
        if (measurement.power === 0) {
            offCount++;
        }
        if (measurement.power !== 0) {
            onCount++;
        }
    }

    result.onPercentage = Number(((onCount / (onCount + offCount)) * 100).toFixed(2));
    result.offPercentage = Number(((offCount / (onCount + offCount)) * 100).toFixed(2));

    return [
        {name: 'Uptime', value: result.onPercentage},
        {name: 'Downtime', value: result.offPercentage}
    ];
}

export const getDailyMedians = (data) => {
    const dailyMeasurements = toDailyData(data, true);
    const result = [];

    for (const key in dailyMeasurements) {
        dailyMeasurements[key].sort((a, b) => (a.power > b.power) ? 1 : -1);
        const length = dailyMeasurements[key].length;
        const halfLength = Math.floor(length / 2);
        let median;

        if (length % 2) {
            median = dailyMeasurements[key][halfLength + 1].power;
        } else {
            median = (dailyMeasurements[key][halfLength].power + dailyMeasurements[key][halfLength + 1].power) / 2;
        }

        result.push({day: key, value: median});
    }

    result.sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));

    return result;
}

export const getDailyAverages = (data) => {
    const dailyMeasurements = toDailyData(data, false);
    const result = [];

    for (const key in dailyMeasurements) {
        result.push({day: key, value: (dailyMeasurements[key].reduce((sum, currentValue) => sum + currentValue.power, 0) / dailyMeasurements[key].length).toFixed(2)});
    }

    result.sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));

    return result;
}

export const getDailyPeaks = (data) => {
    const dailyMeasurements = toDailyData(data, true);
    const result = [];

    for (const key in dailyMeasurements) {
        const max = dailyMeasurements[key].reduce((a, b) => a.power > b.power ? a : b);
        result.push({day: (new Date(max.createdAt)).toISOString(), value: max.power, createdAt: max.createdAt});
    }

    result.sort((a, b) => DAY_ORDER.indexOf(DAY_MAPPING[(new Date(a.day)).getDay()]) - DAY_ORDER.indexOf(DAY_MAPPING[(new Date(b.day)).getDay()]));

    return result;
}

export const groupBy = (array, property) => {
    let hash = {};
    for (let i = 0; i < array.length; i++) {
        if (!hash[array[i][property]]) hash[array[i][property]] = [];
        hash[array[i][property]].push(array[i]);
    }

    return hash;
}

export const getLongestUptimeAndDowntime = (data) => {
    let currStreakUp = 0;
    let longestStreakUp = 0;
    let streakFromUp = null;
    let streakFromTempUp = null;
    let streakToUp = null;

    let currStreakDown = 0;
    let longestStreakDown = 0;
    let streakFromDown = null;
    let streakFromTempDown = null;
    let streakToDown = null;

    for (const key in data) {
        const measurement = data[key];
        if (measurement.power > 0) {
            if (currStreakUp === 0) {
                streakFromTempUp = measurement.createdAt;
            }
            currStreakUp++;
        } else {
            if (currStreakUp > longestStreakUp) {
                longestStreakUp = currStreakUp;
                streakToUp = measurement.createdAt;
                streakFromUp = streakFromTempUp;
            }
            currStreakUp = 0;
        }

        if (measurement.power === 0) {
            if (currStreakDown === 0) {
                streakFromTempDown = measurement.createdAt;
            }
            currStreakDown++;
        } else {
            if (currStreakDown > longestStreakDown) {
                longestStreakDown = currStreakDown;
                streakToDown = measurement.createdAt;
                streakFromDown = streakFromTempDown;
            }
            currStreakDown = 0;
        }
    }

    return {uptimeFrom: streakFromUp, uptimeTo: streakToUp, downtimeFrom: streakFromDown, downtimeTo: streakToDown};
};

export const customDateFormatter = (value) => (new Date(value)).toLocaleString(undefined, {
    month: 'numeric', day: 'numeric', minute: 'numeric', hour: 'numeric'
});

const toDailyData = (data, nonZeroOnly = false) => {
    const dailyMeasurements = {};

    for (const measurement of data) {
        if (nonZeroOnly && measurement.power === 0) {
            continue;
        }

        const createdAt = new Date(measurement.createdAt);
        const day = DAY_MAPPING[createdAt.getDay()];

        if (!dailyMeasurements.hasOwnProperty(day)) {
            dailyMeasurements[day] = [];
        }

        dailyMeasurements[day].push({power: measurement.power, createdAt: measurement.createdAt});
    }

    return dailyMeasurements;
}
