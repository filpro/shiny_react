import React from 'react';
import TransactionForm from './TransactionForm/TransactionForm';
import NewCustomerStore, { CustomerController } from '../../stores/NewCustomer.Store';
import NewTransactionStore, { TransactionController } from '../../stores/NewTransaction.Store';

const TransactionsPage: React.FC = (): JSX.Element => {
    return (
        <>
            <NewCustomerStore.Provider value={new CustomerController()}>
                <NewTransactionStore.Provider value={new TransactionController()}>
                    <TransactionForm />
                </NewTransactionStore.Provider>
            </NewCustomerStore.Provider>
        </>
    );
};

export default TransactionsPage;
