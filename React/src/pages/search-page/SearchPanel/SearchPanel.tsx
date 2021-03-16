import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { createStyles, makeStyles, Theme, Typography, Grid, CircularProgress } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FilterListIcon from '@material-ui/icons/FilterList';
import ListIcon from '@material-ui/icons/List';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import ItemList from './ItemList/ItemList';
import withTranslate, { WithTranslateProps } from '../../../infrastructure/internationalization/hoc/WithTranslate';
import Translations from '../../../infrastructure/internationalization/Translations';

import InspectTransactionStore from '../../../stores/TransactionInspect.Store';

import Filters from './Filters/Filters';
import Statistics from './Statistics/Statistics';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                marginTop: theme.spacing(1),
                marginBottom: theme.spacing(1),
                width: '100%',
            },
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
            // flexBasis: '70%',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            paddingLeft: '5px',
        },
        secondaryHeading: {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
        loadedIcon: {
            verticalAlign: 'middle',
            color: 'green',
        },
        loadStatus: {
            verticalAlign: 'middle',
        },
        filterTitle: {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        filterIcon: {
            fontSize: '20px',
        },
    })
);

const SearchPanel: React.FC<WithTranslateProps> = observer(
    (props: WithTranslateProps): JSX.Element => {
        const inspectTransactionsStore = useContext(InspectTransactionStore);
        const classes = useStyles();
        const noOfFiltersApplied = [
            inspectTransactionsStore.productIdsFilter,
            inspectTransactionsStore.customerIdsFilter,
            inspectTransactionsStore.transmissionDatesFilter,
        ].filter((filter) => filter !== undefined && filter.length > 0).length;
        return (
            <div className={`${classes.root}`}>
                <Accordion elevation={4}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Grid
                            justify="space-between" // Add it here :)
                            container
                        >
                            <Grid item className={classes.filterTitle}>
                                <FilterListIcon className={classes.filterIcon} />
                                <Typography className={classes.heading}>
                                    {`${props.translate(Translations.SearchTransaction.Filters.Filters)} ${
                                        noOfFiltersApplied > 0 ? ` (${noOfFiltersApplied})` : ''
                                    }`}
                                </Typography>
                            </Grid>
                            <Grid item>
                                {inspectTransactionsStore.isLoading ? (
                                    <CircularProgress color="secondary" size={24} className={classes.loadStatus} />
                                ) : (
                                    <Typography className={`${classes.secondaryHeading}`}>
                                        {`${inspectTransactionsStore.dateFrom.toLocaleDateString(
                                            'PL-pl'
                                        )} - ${inspectTransactionsStore.dateTo.toLocaleDateString('PL-pl')}      `}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Filters />
                    </AccordionDetails>
                </Accordion>
                <Accordion elevation={4} className={`${classes.root}`}>
                    <AccordionSummary className={classes.filterTitle} expandIcon={<ExpandMoreIcon />}>
                        <DataUsageIcon className={classes.filterIcon} />
                        <Typography className={classes.heading}>{props.translate(Translations.SearchTransaction.Summary.Summary)}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Statistics isLoading={inspectTransactionsStore.isLoading} transactions={inspectTransactionsStore.localFilteredTransactions} />
                    </AccordionDetails>
                </Accordion>
                <Accordion elevation={4} className={`${classes.root}`}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Grid
                            justify="space-between" // Add it here :)
                            container
                        >
                            <Grid item className={classes.filterTitle}>
                                <ListIcon className={classes.filterIcon} />
                                <Typography className={classes.heading}>
                                    {props.translate(Translations.SearchTransaction.TransactionsList.TransactionsList)}
                                </Typography>
                            </Grid>
                            <Grid item>
                                {inspectTransactionsStore.isLoading ? (
                                    <CircularProgress color="secondary" size={24} className={classes.loadStatus} />
                                ) : (
                                    <Typography className={classes.secondaryHeading}>{inspectTransactionsStore.localFilteredTransactions?.length}</Typography>
                                )}
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ItemList />
                    </AccordionDetails>
                </Accordion>
            </div>
        );
    }
);

export default withTranslate(SearchPanel);
