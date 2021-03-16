import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { makeStyles, createStyles, Grid, Typography } from '@material-ui/core';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import Customer from '../../../../models/Customer';
import Product from '../../../../models/Product';
import FilterSelect from '../FilterSelect/FilterSelect';
import DateRange from '../DateRange/DateRange';
import withTranslate, { WithTranslateProps } from '../../../../infrastructure/internationalization/hoc/WithTranslate';
import Translations from '../../../../infrastructure/internationalization/Translations';
import dateDiffInDays from '../../../../utils/DateDiffInDays';
import InspectTransactionStore from '../../../../stores/TransactionInspect.Store';

const useStyles = makeStyles(() =>
    createStyles({
        mainItemPart: {
            fontWeight: 300,
        },
        subtitleItemPart: {
            fontWeight: 200,
        },
    })
);

const Filters = observer(
    (props: WithTranslateProps): JSX.Element => {
        const inspectTransactionsStore = useContext(InspectTransactionStore);
        const classes = useStyles();

        const intervalMessage = (date1: any, date2: any) => {
            const result = dateDiffInDays(date1, date2);
            // eslint-disable-next-line no-nested-ternary
            const resultText = result === 0 ? 'dzisiaj' : result === 1 ? 'wczoraj' : result === 2 ? 'przedwczoraj' : `${result} dni temu`;
            return resultText;
        };

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
                                <Grid container justify="space-between">
                                    <Grid>
                                        <Typography className={classes.mainItemPart}>{`${option}`}</Typography>
                                    </Grid>
                                    <Grid>
                                        <Typography  className={classes.subtitleItemPart} variant="caption" display="block" gutterBottom>
                                            {`(${intervalMessage(option, Date())})`}
                                        </Typography>
                                    </Grid>
                                </Grid>
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
                        renderOption={(option: Customer, { inputValue }) => {
                            const text = `${option.FIRST_NAME} ${option.LAST_NAME}`;
                            const matches = match(text, inputValue);
                            const parts: { text: string; highlight: boolean }[] = parse(text, matches);
                            return (
                                <div>
                                    {parts.map((part, index: number) => (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <span key={index} style={{ fontWeight: part.highlight ? 700 : 350 }}>
                                            {part.text}
                                        </span>
                                    ))}
                                </div>
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
                                    <Typography className={classes.mainItemPart}>{`${option.PRODUCT_NAME}`}</Typography>
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
