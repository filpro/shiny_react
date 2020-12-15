import React from 'react';
import DenseTable from '../../components/Mytable/Mytable';
import NewCustomerStore, { CustomerController } from '../../stores/NewCustomer.Store';

const SearchPage: React.FC = (): JSX.Element => {
    return (
        <div>
            <NewCustomerStore.Provider value={new CustomerController()}>
                <DenseTable />
            </NewCustomerStore.Provider>
        </div>
    );
};

export default SearchPage;
