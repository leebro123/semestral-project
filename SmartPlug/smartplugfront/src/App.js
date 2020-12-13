import './App.scss';
import {Container} from '@material-ui/core';
import GeneralLineChartLayout from './components/GeneralLineChartLayout';
import React from 'react';

function App() {
    return (
        <div className="App">
            <header>
                <h1>SmartPlug Charts</h1>
            </header>
            <Container maxWidth="md">
                <GeneralLineChartLayout/>
            </Container>
        </div>
    );
}

export default App;
