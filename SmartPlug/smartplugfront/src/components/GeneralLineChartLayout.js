import React from 'react';
import {CircularProgress} from '@material-ui/core';
import axios from 'axios';
import {useEffect, useState} from 'react'
import links from '../links';
import GeneralLineChart from './GeneralLineChart';

const GeneralLineChartLayout = (props) => {
    const [emeters, setEmeters] = useState(null);
    const [isEmeterLoading, setIsEmeterLoading] = useState(false);

    useEffect(() => {
        setIsEmeterLoading(true);
        // axios.get(links.all).then((response) => {
        axios.get(links.byDate, {params: {fromDate: '12-01-2020', toDate: '12-14-2020'}}).then((response) => {
            const filtered = response.data.filter((value, index) => {
                return index % 8 === 0;
            });
            setEmeters(filtered);
            setIsEmeterLoading(false);
        }).catch((error) => {
            console.error(error);
            setIsEmeterLoading(false);
        });
    }, []);

    return <>
        {isEmeterLoading ? <CircularProgress color="secondary"/> :
            emeters ? <GeneralLineChart chartData={emeters}/> : null}
    </>
}

export default GeneralLineChartLayout;
