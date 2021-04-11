import './App.scss';
import {Container} from '@material-ui/core';
import AppLayout from './components/AppLayout';
import React from 'react';

function App() {
    return (
        <div className="App">
            <header>
                <h1>SmartPlug Charts</h1>
            </header>
            <Container maxWidth="lg">
                <AppLayout/>
            </Container>
        </div>
    );
}

export default App;
