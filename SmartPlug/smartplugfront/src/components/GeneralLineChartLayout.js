import React from 'react';
import {CircularProgress} from '@material-ui/core';
import axios from 'axios';
import {useEffect, useState} from 'react'
import links from '../links';
import GeneralLineChart from './GeneralLineChart';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const GeneralLineChartLayout = (props) => {
    const [emeters, setEmeters] = useState([]);
    const [isEmeterLoading, setIsEmeterLoading] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    useEffect(() => {
        setIsEmeterLoading(true);
        const areDatesSelected = fromDate && toDate;

        if ((fromDate !== null && toDate !== null) || emeters.length === 0) {
            axios.get(areDatesSelected ? links.byDate : links.all, areDatesSelected ? {params: {fromDate: fromDate.toISOString(), toDate: toDate.toISOString()}} : null).then((response) => {
                const filtered = response.data.filter((value, index) => {
                    return index % (response.data.length > 10000 ? 8 : 4) === 0;
                });
                setEmeters(filtered);
                setIsEmeterLoading(false);
            }).catch((error) => {
                console.error(error);
                setIsEmeterLoading(false);
            });
        }
    }, [fromDate, toDate]);

    return <>
        <div className={'datePickers'}>
            From <DatePicker selected={fromDate} onChange={date => setFromDate(date)}/><br/>
            To <DatePicker selected={toDate} onChange={date => setToDate(date)}/>
        </div>
        {isEmeterLoading ? <CircularProgress/> :
            emeters ? <GeneralLineChart chartData={emeters}/> : null}
    </>;
}

export default GeneralLineChartLayout;
