import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import plLocale from 'date-fns/locale/pl';
import InspectTransactionStore from '../../../../stores/TransactionInspect.Store';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dateRangeLeft: {
            width: '100%',
            paddingRight: theme.spacing(2),
        },
        dateRangeRight: {
            width: '100%',
            paddingLeft: theme.spacing(2),
        },
    })
);

const DateRange: React.FC = observer(
    (): JSX.Element => {
        const inspectTransactionsStore = useContext(InspectTransactionStore);
        const classes = useStyles();
        return (
            <Grid container justify="space-between">
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} className={classes.dateRangeLeft}>
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
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6} className={classes.dateRangeRight}>
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
            </Grid>
        );
    }
);

export default DateRange;
