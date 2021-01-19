import { Card, CardContent, createStyles, makeStyles, Grid, Typography, Theme } from '@material-ui/core';
import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Transaction from '../../../../models/Transaction';

interface IProps {
    transactions: Transaction[] | undefined;
    isLoading: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            margin: theme.spacing(1),
            background: 'rgba(128, 128, 128, 0.1)',
        },
        title: {
            fontSize: 14,
        },
        pos: {
            marginBottom: 12,
        },
    })
);

const Statistics = (props: IProps): JSX.Element => {
    const classes = useStyles();
    return props.transactions ? (
        <Grid container>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Ilość transakcji
                        </Typography>
                        {props.isLoading ? (
                            <Skeleton variant="rect" height={24} />
                        ) : (
                            <Typography variant="h5" component="h2">
                                {props.transactions.length}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Liczba klientów
                        </Typography>
                        {props.isLoading ? (
                            <Skeleton variant="rect" height={24} />
                        ) : (
                            <Typography variant="h5" component="h2">
                                {props.transactions.map((x) => x.CUSTOMER_ID).filter((x, i, a) => a.indexOf(x) === i).length}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Obrót
                        </Typography>
                        {props.isLoading ? (
                            <Skeleton variant="rect" height={24} />
                        ) : (
                            <Typography variant="h5" component="h2">
                                {new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(
                                    Math.round(props.transactions.map((x) => x.PRODUCT_PRICE).reduce((a, b) => a + b, 0))
                                )}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    ) : (
        <></>
    );
};

export default Statistics;
