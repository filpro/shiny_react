import { makeStyles, Theme, createStyles, Grid, Container } from '@material-ui/core';
import React, { useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import { observer } from 'mobx-react';
import ClientSelect from './ClientSelect/ClientSelect';
import DatePicker from './DatePicker/DatePicker';
import PriceInput from './PriceInput/PriceInput';
import ProductName from './ProductId/ProductId';
import TransactionConfirmation from './TransactionConfirmation/TransactionConfirmation';
import NewCustomerStore from '../../../stores/NewCustomer.Store';
import NewTransactionStore from '../../../stores/NewTransaction.Store';
import TransactionService from '../../../services/TransactionService';
import Transaction from '../../../models/Transaction';
import Product from '../../../models/Product';

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

const TransactionForm: React.FC = observer(
    (): JSX.Element => {
        const classes = useStyles();
        const newCustomerStore = useContext(NewCustomerStore);
        const newTransactionStore = useContext(NewTransactionStore);
        const [transactionDate, setTransactionDate] = useState<Date | null>(new Date());
        const [productName, setProductId] = useState('');
        const [productPrice, setProductPrice] = useState('');
        const [openConfirmationDialog, setOpenConfirmationDialog] = React.useState(false);

        const handleproductIdChange = (id: string): void => {
            setProductId(id.toUpperCase());
        };

        const handleConfirmation = () => {
            if (newCustomerStore.selectedCustomer) {
                setOpenConfirmationDialog(true);
            }
        };

        const handleHasConfirmed = () => {
            newTransactionStore.addTransaction(new Product(productName), new Transaction(newCustomerStore.selectedCustomer!.ID, transactionDate, productPrice));
        };

        const handleTransactionDateChange = (date: Date) => {
            console.log(date);
            setTransactionDate(date);
        };

        return (
            <Container>
                {newCustomerStore.selectedCustomer ? (
                    <TransactionConfirmation
                        open={openConfirmationDialog}
                        setOpen={setOpenConfirmationDialog}
                        transactionDate={transactionDate}
                        productId={productName}
                        clientSelected={newCustomerStore.selectedCustomer}
                        productPrice={productPrice}
                        handleHasConfirmed={handleHasConfirmed}
                    />
                ) : null}
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <form className={classes.root} noValidate>
                        <div>
                            <DatePicker date={transactionDate} handleDateChange={handleTransactionDateChange} />
                        </div>
                        <div>
                            <ProductName productName={productName} handleProductNameChange={handleproductIdChange} />
                        </div>
                        <div>
                            <ClientSelect />
                        </div>
                        <div>
                            <PriceInput productPrice={productPrice} handleProductPriceChange={setProductPrice} />
                        </div>
                        <div>
                            <Button variant="contained" size="large" color="primary" className={classes.submitButton} onClick={handleConfirmation}>
                                SPRZEDANO
                            </Button>
                        </div>
                    </form>
                </Grid>
            </Container>
        );
    }
);

export default React.memo(TransactionForm);
