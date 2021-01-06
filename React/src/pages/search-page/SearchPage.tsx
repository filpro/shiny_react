import { makeStyles, Theme, createStyles, Grid, Paper } from '@material-ui/core';
import React from 'react';
import DenseTable from '../../components/Mytable/Mytable';
import TransactionInspect, { TransactionController } from '../../stores/TransactionInspect.Store';
import SearchPanel from './SearchPanel/SearchPanel';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            margin: `${theme.spacing(2)}px auto`,
            padding: theme.spacing(2),
        },
    })
);

const SearchPage: React.FC = (): JSX.Element => {
    const classes = useStyles();

    return (
        <div>
            <TransactionInspect.Provider value={new TransactionController()}>
                <Paper className={classes.paper}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <SearchPanel />
                    </Grid>
                </Paper>
                <Paper className={classes.paper}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <DenseTable />
                    </Grid>
                </Paper>
            </TransactionInspect.Provider>
        </div>
    );
};

export default SearchPage;
