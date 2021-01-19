/* eslint-disable no-use-before-define */
import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button, Divider } from '@material-ui/core';
import ClientAdder from './ClientAdder/ClientAdder';
import Customer from '../../../../models/Customer';
import NewCustomerStore from '../../../../stores/Customer.Store';

const ClientSelect: React.FC = observer(
    (): JSX.Element => {
        const newCustomerStore = useContext(NewCustomerStore);

        const [open, setOpen] = React.useState(false);
        const [inputValue, setInputValue] = React.useState('');

        const newClientHandler = (): void => {
            setOpen(true);
        };

        const addNew = (customer: Customer): void => {
            newCustomerStore.addCustomer(customer);
        };

        const handleChangeSelected = (customer: Customer | null): void => {
            if (customer !== null) {
                newCustomerStore.setSelected(customer);
                setInputValue(`${customer.FIRST_NAME} ${customer.LAST_NAME}`);
            }
        };
        return (
            <>
                <ClientAdder open={open} setOpen={setOpen} addNewCustomer={addNew} />
                <Autocomplete
                    size="small"
                    id="combo-box-demo"
                    options={newCustomerStore.allCustomers || []}
                    getOptionLabel={(option) => (option === null ? '' : `${option.FIRST_NAME} ${option.LAST_NAME}`)}
                    value={newCustomerStore.selectedCustomer || null}
                    onChange={(_, newValue) => handleChangeSelected(newValue)}
                    inputValue={inputValue}
                    onInputChange={(_, newValue) => setInputValue(newValue)}
                    renderInput={(params) => <TextField {...params} label="Nazwa klienta" fullWidth />}
                    renderOption={(option) => {
                        return (
                            <>
                                <div>
                                    {`${option.FIRST_NAME} ${option.LAST_NAME}`}
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
