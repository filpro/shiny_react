import { Card, CardContent, createStyles, makeStyles, Grid, Typography, Theme } from '@material-ui/core';
import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Transaction from '../../../../models/Transaction';
import withTranslate, { WithTranslateProps } from '../../../../infrastructure/internationalization/hoc/WithTranslate';
import Translations from '../../../../infrastructure/internationalization/Translations';

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

const Statistics = (props: IProps & WithTranslateProps): JSX.Element => {
    const classes = useStyles();
    return props.transactions ? (
        <Grid container>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            {props.translate(Translations.SearchTransaction.Summary.TransmissionsCount)}
                        </Typography>
                        {props.isLoading ? (
                            <Skeleton variant="rect" height={24} />
                        ) : (
                            <Typography variant="h5" component="h2">
                                {props.transactions.map((x) => x.TRANSMISSION_ID).filter((x, i, a) => a.indexOf(x) === i).length}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            {props.translate(Translations.SearchTransaction.Summary.TransactionsCount)}
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
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            {props.translate(Translations.SearchTransaction.Summary.CustomersCount)}
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
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            {props.translate(Translations.SearchTransaction.Summary.TurnoverSum)}
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

export default withTranslate(Statistics);
