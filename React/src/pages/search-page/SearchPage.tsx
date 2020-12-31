import React from 'react';
import DenseTable from '../../components/Mytable/Mytable';
import NewTransactionStore, { TransactionController } from '../../stores/NewTransaction.Store';

const SearchPage: React.FC = (): JSX.Element => {
    return (
        <div>
            <NewTransactionStore.Provider value={new TransactionController()}>
                <DenseTable />
            </NewTransactionStore.Provider>
        </div>
    );
};

export default SearchPage;
