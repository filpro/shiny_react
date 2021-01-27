import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import TransactionInspect, { TransactionController } from './stores/TransactionInspect.Store';

ReactDOM.render(
    <Router>
        <TransactionInspect.Provider value={new TransactionController()}>
            <App />
        </TransactionInspect.Provider>
    </Router>,
    document.getElementById('root')
);
