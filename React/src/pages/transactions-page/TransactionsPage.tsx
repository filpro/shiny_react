import React from 'react';
import TransactionForm from './TransactionForm/TransactionForm';
import NewCustomerStore, { CustomerController } from '../../stores/NewCustomer.Store';

const TransactionsPage: React.FC = (): JSX.Element => {
    return (
        <>
            <NewCustomerStore.Provider value={new CustomerController()}>
                <TransactionForm />
            </NewCustomerStore.Provider>
        </>
    );
};

export default TransactionsPage;
