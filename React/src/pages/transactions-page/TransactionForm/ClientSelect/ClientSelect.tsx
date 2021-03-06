/* eslint-disable no-use-before-define */
import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button, CircularProgress, createStyles, makeStyles } from '@material-ui/core';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import ClientAdder from './ClientAdder/ClientAdder';
import Customer from '../../../../models/Customer';
import CustomerStore from '../../../../stores/Customer.Store';
import withTranslate, { WithTranslateProps } from '../../../../infrastructure/internationalization/hoc/WithTranslate';
import Translations from '../../../../infrastructure/internationalization/Translations';

const useStyles = makeStyles(() =>
    createStyles({
        mainItemPart: {
            fontWeight: 300,
            fontSize: '0.9rem',
            lineHeight: 1,
        },
        listbox: {
            padding: 0,
        },
        option: {
            minHeight: '25px',
            height: '25px',
        },
    })
);

interface IProps {
    wait: boolean;
}

const ClientSelect: React.FC<IProps & WithTranslateProps> = observer(
    (props: IProps & WithTranslateProps): JSX.Element => {
        const customerStore = useContext(CustomerStore);
        const classes = useStyles();

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
                    debug
                    blurOnSelect
                    classes={{
                        option: classes.option,
                        listbox: classes.listbox,
                    }}
                    id="combo-box-demo"
                    options={getSortedCustomers(customerStore.allCustomers) || []}
                    getOptionLabel={(option) => (option === null ? '' : `${option.FIRST_NAME} ${option.LAST_NAME}`)}
                    value={customerStore.selectedCustomer || null}
                    onChange={(_, newValue) => handleChangeSelected(newValue)}
                    inputValue={inputValue}
                    onInputChange={(_, newValue) => setInputValue(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label={props.translate(Translations.NewTransaction.ClientName)} fullWidth variant="outlined" required />
                    )}
                    renderOption={(option) => {
                        const text = `${option.FIRST_NAME} ${option.LAST_NAME}`;
                        const matches = match(text, inputValue);
                        const parts: { text: string; highlight: boolean }[] = parse(text, matches);
                        return (
                            <div>
                                {parts.map((part, index: number) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <span key={index} style={{ height: 25, fontWeight: part.highlight ? 700 : 350 }}>
                                        {part.text}
                                    </span>
                                ))}
                            </div>
                        );
                    }}
                    noOptionsText={
                        props.wait ? (
                            <CircularProgress size={19} />
                        ) : (
                            <Button onMouseDown={() => newClientHandler()}>{props.translate(Translations.NewTransaction.AddNewCustomer)}</Button>
                        )
                    }
                    ListboxProps={{
                        style: {
                            maxHeight: '200px',
                            border: '0.5px solid lightgrey',
                            borderRadius: '8px',
                        },
                    }}
                />
            </>
        );
    }
);

export default withTranslate(ClientSelect);
