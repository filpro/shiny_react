/* eslint-disable no-use-before-define */
import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button, Divider } from '@material-ui/core';
import ClientAdder from './ClientAdder/ClientAdder';
import Customer from '../../../../models/Customer';
import CustomerStore from '../../../../stores/Customer.Store';

const ClientSelect: React.FC = observer(
    (): JSX.Element => {
        const customerStore = useContext(CustomerStore);

        const [open, setOpen] = React.useState(false);
        const [inputValue, setInputValue] = React.useState('');

        const newClientHandler = (): void => {
            setOpen(true);
        };

        const addNew = (customer: Customer): void => {
            customerStore.addCustomer(customer);
        };

        const handleChangeSelected = (customer: Customer | null): void => {
            if (customer !== null) {
                customerStore.setSelected(customer);
                setInputValue(`${customer.FIRST_NAME} ${customer.LAST_NAME}`);
            }
        };

        const getSortedCustomers = (customers: Customer[] | undefined): Customer[] | undefined => {
            if (customers) {
                return customers
                    ?.slice()
                    .sort(
                        (cust1, cust2) =>
                            (cust2.LAST_TRANSACTION ? new Date(cust2.LAST_TRANSACTION).getTime() : 0) -
                            (cust1.LAST_TRANSACTION ? new Date(cust1.LAST_TRANSACTION).getTime() : 0)
                    );
            }
            return undefined;
        };

        return (
            <>
                <ClientAdder open={open} setOpen={setOpen} addNewCustomer={addNew} />
                <Autocomplete
                    size="small"
                    id="combo-box-demo"
                    options={getSortedCustomers(customerStore.allCustomers) || []}
                    getOptionLabel={(option) => (option === null ? '' : `${option.FIRST_NAME} ${option.LAST_NAME}`)}
                    value={customerStore.selectedCustomer || null}
                    onChange={(_, newValue) => handleChangeSelected(newValue)}
                    inputValue={inputValue}
                    onInputChange={(_, newValue) => setInputValue(newValue)}
                    renderInput={(params) => <TextField {...params} label="Nazwa klienta" fullWidth />}
                    renderOption={(option) => {
                        return (
                            <>
                                <div>
                                    {`${option.FIRST_NAME} ${option.LAST_NAME} (${option.LAST_TRANSACTION})`}
                                    <Divider />
                                </div>
                            </>
                        );
                    }}
                    noOptionsText={<Button onMouseDown={() => newClientHandler()}>Dodaj nowego klienta</Button>}
                    ListboxProps={{
                        style: {
                            maxHeight: '150px',
                            border: '1px solid black',
                            fontSize: 'small',
                        },
                    }}
                />
            </>
        );
    }
);

export default ClientSelect;
