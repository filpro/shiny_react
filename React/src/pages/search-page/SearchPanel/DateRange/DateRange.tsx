import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { createStyles, Grid, makeStyles } from '@material-ui/core';
import plLocale from 'date-fns/locale/pl';
import InspectTransactionStore from '../../../../stores/TransactionInspect.Store';

const useStyles = makeStyles(() =>
    createStyles({
        dateRange: {
            maxWidth: '100%',
        },
    })
);

const DateRange: React.FC = observer(
    (): JSX.Element => {
        const inspectTransactionsStore = useContext(InspectTransactionStore);
        const classes = useStyles();
        return (
            <>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} className={classes.dateRange}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={plLocale}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd-MM-yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Od"
                            value={inspectTransactionsStore.dateFrom}
                            onChange={(e) => inspectTransactionsStore.setDateFrom(e)}
                            autoOk
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            fullWidth
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} className={classes.dateRange}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={plLocale}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd-MM-yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Do"
                            value={inspectTransactionsStore.dateTo}
                            onChange={(e) => inspectTransactionsStore.setDateTo(e)}
                            autoOk
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            fullWidth
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
            </>
        );
    }
);

export default DateRange;
