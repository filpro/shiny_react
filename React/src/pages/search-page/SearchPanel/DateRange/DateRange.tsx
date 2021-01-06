import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { createStyles, Grid, makeStyles, Theme, useTheme } from '@material-ui/core';
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
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.dateRange}>
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
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.dateRange}>
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
                </Grid>
            </MuiPickersUtilsProvider>
        );
    }
);

export default DateRange;
