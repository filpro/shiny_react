import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { createStyles, makeStyles, Theme, Typography, Grid, CircularProgress } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckIcon from '@material-ui/icons/Check';
import ItemList from './ItemList/ItemList';

import InspectTransactionStore from '../../../stores/TransactionInspect.Store';

import Filters from './Filters/Filters';
import Statistics from './Statistics/Statistics';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '100%',
            },
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
            // flexBasis: '70%',
            flexShrink: 0,
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
    })
);

const SearchPanel: React.FC = observer(
    (): JSX.Element => {
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
                            <Grid item>
                                <Typography className={classes.heading}>{`FILTRY ${noOfFiltersApplied > 0 ? ` (${noOfFiltersApplied})` : ''}`}</Typography>
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
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>PODSUMOWANIE</Typography>
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
                            <Grid item>
                                <Typography className={classes.heading}>LISTA TRANSAKCJI</Typography>
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

export default SearchPanel;
