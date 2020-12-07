import { makeStyles, Theme, createStyles, Grid, Container } from '@material-ui/core';
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import ClientSelect from './ClientSelect/ClientSelect';
import DatePicker from './DatePicker/DatePicker';
import PriceInput from './PriceInput/PriceInput';
import ProductId from './ProductId/ProductId';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '100%',
            },
        },
        submitButton: {
            margin: theme.spacing(1),
            width: '100%',
        },
    })
);

const TransactionForm: React.FC = (): JSX.Element => {
    const classes = useStyles();
    const [price, setPrice] = useState('');

    return (
        <Container>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <form className={classes.root} noValidate>
                    <div>
                        <DatePicker />
                    </div>
                    <div>
                        <ProductId />
                    </div>
                    <div>
                        <ClientSelect />
                    </div>
                    <div>
                        <PriceInput value={price} changeHandler={setPrice} />
                    </div>
                    <div>
                        <Button variant="contained" size="large" color="primary" className={classes.submitButton}>
                            SPRZEDANO
                        </Button>
                    </div>
                </form>
            </Grid>
        </Container>
    );
};

export default TransactionForm;
