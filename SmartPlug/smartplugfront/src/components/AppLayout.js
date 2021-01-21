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

const AppLayout = () => {
    const [emeters, setEmeters] = useState([]);
    const [isEmeterLoading, setIsEmeterLoading] = useState(false);
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
            setIsEmeterLoading(true);
            axios.get(links.byDate, {params: {fromDate: fromDate.toISOString(), toDate: toDate.toISOString()}}).then((response) => {
                const filtered = response.data.filter((value, index) => {
                    return index % (response.data.length > 10000 ? 10 : 4) === 0;
                });
                setEmeters(filtered);
                setIsEmeterLoading(false);
            }).catch((error) => {
                console.error(error);
                setIsEmeterLoading(false);
            });
        }
    }, [fromDate, toDate]);

    useEffect(() => {
        console.log(emeters);
        if (emeters.length === 0) {
            setIsEmeterLoading(true);
            axios.get(links.all).then((response) => {
                const filtered = response.data.filter((value, index) => {
                    return index % 20 === 0;
                });
                setEmeters(filtered);
                setIsEmeterLoading(false);
            }).catch((error) => {
                console.error(error);
                setIsEmeterLoading(false);
            });
        }
    }, [emeters]);

    return <>
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
                <Tab>Analysis 1</Tab>
                <Tab>Analysis 2</Tab>
            </TabList>

            <TabPanel>
                {isEmeterLoading ? <Loading/> :
                    emeters ? <GeneralLineChart
                            chartData={emeters}
                            power={filters.checkedPower}
                            current={filters.checkedCurrent}
                            voltage={filters.checkedVoltage}
                        />
                        : null}
            </TabPanel>
            <TabPanel>
                123
            </TabPanel>
            <TabPanel>
                123
            </TabPanel>
        </Tabs>
    </>;
}

export default AppLayout;
