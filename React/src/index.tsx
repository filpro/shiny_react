import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import TransactionInspect, { TransactionController } from './stores/TransactionInspect.Store';
import NewCustomerStore, { CustomerController } from './stores/Customer.Store';
import NewTransactionStore, { NewTransactionController } from './stores/NewTransaction.Store';
import Auth0ProviderWithHistory from './auth/auth0-provider-with-history';

ReactDOM.render(
    <Router>
        <Auth0ProviderWithHistory>
            <TransactionInspect.Provider value={new TransactionController()}>
                <NewCustomerStore.Provider value={new CustomerController()}>
                    <NewTransactionStore.Provider value={new NewTransactionController()}>
                        <App />
                    </NewTransactionStore.Provider>
                </NewCustomerStore.Provider>
            </TransactionInspect.Provider>
        </Auth0ProviderWithHistory>
    </Router>,
    document.getElementById('root')
);
