import React from 'react';
import { makeStyles, Theme, createStyles, Paper, Grid } from '@material-ui/core';
import TransactionForm from './TransactionForm/TransactionForm';
import NewCustomerStore, { CustomerController } from '../../stores/NewCustomer.Store';
import NewTransactionStore, { TransactionController } from '../../stores/NewTransaction.Store';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            margin: `${theme.spacing(2)}px auto`,
            padding: theme.spacing(2),
        },
    })
);

const TransactionsPage: React.FC = (): JSX.Element => {
    const classes = useStyles();

    return (
        <>
            <NewCustomerStore.Provider value={new CustomerController()}>
                <NewTransactionStore.Provider value={new TransactionController()}>
                    <Paper className={classes.paper}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TransactionForm />
                        </Grid>
                    </Paper>
                </NewTransactionStore.Provider>
            </NewCustomerStore.Provider>
        </>
    );
};

export default TransactionsPage;
