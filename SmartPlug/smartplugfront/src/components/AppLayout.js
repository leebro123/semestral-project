import React from 'react';
import {FormControlLabel, FormGroup} from '@material-ui/core';
import axios from 'axios';
import {useEffect, useState} from 'react'
import links from '../links';
import GeneralLineChart from './GeneralLineChart';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Loading from './Loading';
import {AmberCheckbox, PurpleCheckbox, RedCheckbox} from './Checkboxes';
import KMeansLayout from './KMeansLayout';
import DBSCANLayout from './DBSCANLayout';
import StatisticsLayout from './StatisticsLayout';

const DOWNSAMPLE_LOW = 5;
const DOWNSAMPLE_MEDIUM = 10;
const DOWNSAMPLE_HIGH = 40;

const AppLayout = () => {
    const [chartData, setChartData] = useState([]);
    const [emeters, setEmeters] = useState([]);
    const [areEmetersLoading, setAreEmetersLoading] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const [filters, setFilters] = useState({
        checkedPower: true,
        checkedCurrent: true,
        checkedVoltage: true
    });

    const handleFilterChange = (event) => {
        setFilters({...filters, [event.target.name]: event.target.checked});
    };

    useEffect(() => {
        const areDatesSelected = fromDate !== null && toDate !== null;

        if (areDatesSelected) {
            setAreEmetersLoading(true);
            axios.get(links.byDate, {params: {fromDate: fromDate.toISOString(), toDate: toDate.toISOString()}}).then((response) => {
                const filtered = response.data.filter((value, index) => {
                    return index % (response.data.length > 10000 ? DOWNSAMPLE_MEDIUM : DOWNSAMPLE_LOW) === 0;
                });
                setChartData(filtered);
                setEmeters(response.data);
                setAreEmetersLoading(false);
            }).catch((error) => {
                console.error(error);
                setAreEmetersLoading(false);
            });
        }
    }, [fromDate, toDate]);

    useEffect(() => {
        if (chartData.length === 0) {
            setAreEmetersLoading(true);
            axios.get(links.all).then((response) => {
                const filtered = response.data.filter((value, index) => {
                    return index % DOWNSAMPLE_HIGH === 0;
                });
                setChartData(filtered);
                setEmeters(response.data);
                setAreEmetersLoading(false);
            }).catch((error) => {
                console.error(error);
                setAreEmetersLoading(false);
            });
        }
    }, [chartData]);


    return <>
        <div className={'columns'}>
            <div className={'columns__statistics'}>
                {areEmetersLoading || !emeters.length ? <Loading/> : <StatisticsLayout data={emeters}/>}
            </div>
            <div className={'columns__content'}>
                <div className={'settings'}>
                    <div className={'datePickers'}>
                        <div className={'datePickers__row'}>
                            <div className={'datePickers__label'}>
                                From
                            </div>
                            <div className={'datePickers__input'}>
                                <DatePicker selected={fromDate} onChange={date => setFromDate(date)}/>
                            </div>
                        </div>
                        <div className={'datePickers__row'}>
                            <div className={'datePickers__label'}>
                                To
                            </div>
                            <div className={'datePickers__input'}>
                                <DatePicker selected={toDate} onChange={date => setToDate(date)}/>
                            </div>
                        </div>
                    </div>
                    <FormGroup className={'filters'}>
                        <FormControlLabel
                            control={<AmberCheckbox checked={filters.checkedVoltage} onChange={handleFilterChange} name="checkedVoltage"/>}
                            label="Voltage"
                        />
                        <FormControlLabel
                            control={<RedCheckbox checked={filters.checkedCurrent} onChange={handleFilterChange} name="checkedCurrent"/>}
                            label="Current"
                        />
                        <FormControlLabel
                            control={<PurpleCheckbox checked={filters.checkedPower} onChange={handleFilterChange} name="checkedPower"/>}
                            label="Power"
                        />
                    </FormGroup>
                </div>


                <Tabs>
                    <TabList>
                        <Tab>General overview</Tab>
                        <Tab>K-Means</Tab>
                        <Tab>DBSCAN</Tab>
                    </TabList>

                    <TabPanel>
                        {/*{areEmetersLoading ? <Loading/> :*/}
                        {/*    chartData ? <GeneralLineChart*/}
                        {/*            chartData={chartData}*/}
                        {/*            power={filters.checkedPower}*/}
                        {/*            current={filters.checkedCurrent}*/}
                        {/*            voltage={filters.checkedVoltage}*/}
                        {/*        />*/}
                        {/*        : null}*/}
                        {areEmetersLoading ? <Loading/> :
                            chartData ? GeneralLineChart({
                                chartData: chartData,
                                power: filters.checkedPower,
                                current: filters.checkedCurrent,
                                voltage: filters.checkedVoltage
                            }) : null}
                    </TabPanel>
                    <TabPanel>
                        {emeters ? KMeansLayout(emeters) : null}
                    </TabPanel>
                    <TabPanel>
                        {/*{chartData ? Forecast(chartData) : null}*/}
                        {emeters ? DBSCANLayout(emeters) : null}
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    </>;
}

export default AppLayout;
