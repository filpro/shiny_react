import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { createStyles, Divider, Grid, makeStyles, Theme } from '@material-ui/core';
import FilterSelect from './FilterSelect/FilterSelect';
import DateRange from './DateRange/DateRange';
import InspectTransactionStore from '../../../stores/TransactionInspect.Store';
import Customer from '../../../models/Customer';
import Product from '../../../models/Product';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '100%',
            },
        },
        text: {
            flexGrow: 1,
            fontSize: 'small',
        },
    })
);

const SearchPanel: React.FC = observer(
    (): JSX.Element => {
        const inspectTransactionsStore = useContext(InspectTransactionStore);
        const classes = useStyles();
        return (
            <div className={classes.root}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <DateRange />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <FilterSelect
                        label="Nazwa klienta"
                        options={inspectTransactionsStore.localFilteredCustomers}
                        filter={inspectTransactionsStore.customerIdsFilter}
                        optionLabel={(option: Customer) => (option === null ? '' : `${option.FIRST_NAME} ${option.LAST_NAME} (${option.ID})`)}
                        renderOption={(option) => {
                            return (
                                <>
                                    <div>
                                        {`${option.FIRST_NAME} ${option.LAST_NAME} (${option.ID})`}
                                        <Divider />
                                    </div>
                                </>
                            );
                        }}
                        changeHandler={inspectTransactionsStore.setCustomerIdsFilter}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <FilterSelect
                        label="Numer produktu"
                        options={inspectTransactionsStore.localFilteredProducts}
                        filter={inspectTransactionsStore.productIdsFilter}
                        optionLabel={(option: Product) => (option === null ? '' : `${option.ID} (${option.PRODUCT_NAME})`)}
                        renderOption={(option) => {
                            return (
                                <>
                                    <div className={classes.text}>
                                        {`${option.ID} (${option.PRODUCT_NAME})`}
                                        <Divider />
                                    </div>
                                </>
                            );
                        }}
                        changeHandler={inspectTransactionsStore.setProductIdsFilter}
                    />
                </Grid>
            </div>
        );
    }
);

export default SearchPanel;
