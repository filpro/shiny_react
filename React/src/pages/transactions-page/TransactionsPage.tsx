import React from 'react';
import { makeStyles, Theme, createStyles, Paper, Box } from '@material-ui/core';
import clsx from 'clsx';
import TransactionForm from './TransactionForm/TransactionForm';

import useResponsiveStyles from '../../shared-styles/Responsive.Styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            margin: theme.spacing(1),
            padding: theme.spacing(1),
        },
    })
);

const TransactionsPage: React.FC = (): JSX.Element => {
    const classes = useStyles();
    const responsiveClasses = useResponsiveStyles();

    return (
        <>
            <Box className={clsx(responsiveClasses.horizontalGaps, responsiveClasses.noHorizontalGapsDownSmall)}>
                <Paper className={classes.paper}>
                    <TransactionForm />
                </Paper>
            </Box>
        </>
    );
};

export default TransactionsPage;
