import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { makeStyles, createStyles, Grid, Divider } from '@material-ui/core';
import Customer from '../../../../models/Customer';
import Product from '../../../../models/Product';
import FilterSelect from '../FilterSelect/FilterSelect';
import DateRange from '../DateRange/DateRange';
import withTranslate, { WithTranslateProps } from '../../../../infrastructure/internationalization/hoc/WithTranslate';
import Translations from '../../../../infrastructure/internationalization/Translations';

import InspectTransactionStore from '../../../../stores/TransactionInspect.Store';

const useStyles = makeStyles(() =>
    createStyles({
        text: {
            flexGrow: 1,
            fontSize: 'small',
        },
    })
);

const Filters = observer(
    (props: WithTranslateProps): JSX.Element => {
        const inspectTransactionsStore = useContext(InspectTransactionStore);
        const classes = useStyles();

        return (
            <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <DateRange />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <FilterSelect
                        label={props.translate(Translations.SearchTransaction.Filters.TransmissionDate)}
                        options={inspectTransactionsStore.localFilteredDates}
                        filter={inspectTransactionsStore.transmissionDatesFilter}
                        optionLabel={(option: Date) => (option === null ? '' : `${option}`)}
                        renderOption={(option) => {
                            return (
                                <>
                                    <div className={classes.text}>
                                        {`${option}`}
                                        <Divider />
                                    </div>
                                </>
                            );
                        }}
                        changeHandler={inspectTransactionsStore.setTransmissionDatesFilter}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <FilterSelect
                        label={props.translate(Translations.SearchTransaction.Filters.CustomerName)}
                        options={inspectTransactionsStore.localFilteredCustomers}
                        filter={inspectTransactionsStore.customerIdsFilter}
                        optionLabel={(option: Customer) => (option === null ? '' : `${option.FIRST_NAME} ${option.LAST_NAME}`)}
                        renderOption={(option) => {
                            return (
                                <>
                                    <div className={classes.text}>
                                        {`${option.FIRST_NAME} ${option.LAST_NAME}`}
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
                        label={props.translate(Translations.SearchTransaction.Filters.ProductName)}
                        options={inspectTransactionsStore.localFilteredProducts}
                        filter={inspectTransactionsStore.productIdsFilter}
                        optionLabel={(option: Product) => (option === null ? '' : `${option.PRODUCT_NAME}`)}
                        renderOption={(option) => {
                            return (
                                <>
                                    <div className={classes.text}>
                                        {`${option.PRODUCT_NAME}`}
                                        <Divider />
                                    </div>
                                </>
                            );
                        }}
                        changeHandler={inspectTransactionsStore.setProductIdsFilter}
                    />
                </Grid>
            </Grid>
        );
    }
);

export default withTranslate(Filters);
