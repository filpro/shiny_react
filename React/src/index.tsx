import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import TransactionInspect, { TransactionController } from './stores/TransactionInspect.Store';
import NewCustomerStore, { CustomerController } from './stores/Customer.Store';
import NewTransactionStore, { NewTransactionController } from './stores/NewTransaction.Store';

ReactDOM.render(
    <TransactionInspect.Provider value={new TransactionController()}>
        <NewCustomerStore.Provider value={new CustomerController()}>
            <NewTransactionStore.Provider value={new NewTransactionController()}>
                <Router>
                    <App />
                </Router>
            </NewTransactionStore.Provider>
        </NewCustomerStore.Provider>
    </TransactionInspect.Provider>,
    document.getElementById('root')
);
