import { makeStyles, Theme, createStyles, Grid, Container, CircularProgress } from '@material-ui/core';
import React, { useState, useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { observer } from 'mobx-react';
import ClientSelect from './ClientSelect/ClientSelect';
import DatePicker from './DatePicker/DatePicker';
import PriceInput from './PriceInput/PriceInput';
import ProductName from './ProductId/ProductId';
import TransactionConfirmation from './TransactionConfirmation/TransactionConfirmation';
import CustomerStore from '../../../stores/Customer.Store';
import NewTransactionStore from '../../../stores/NewTransaction.Store';

import Transaction from '../../../models/Transaction';
import Product from '../../../models/Product';
import Customer from '../../../models/Customer';

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
            backgroundColor: 'rgba(221,221,221,1)',
        },
    })
);

const TransactionForm: React.FC = observer(
    (): JSX.Element => {
        const classes = useStyles();
        const customerStore = useContext(CustomerStore);
        const newTransactionStore = useContext(NewTransactionStore);
        const [transactionDate, setTransactionDate] = useState<Date | null>(new Date());
        const [productName, setProductId] = useState('');
        const [productPrice, setProductPrice] = useState<string>('');
        const [openConfirmationDialog, setOpenConfirmationDialog] = React.useState(false);

        useEffect(() => {
            const timeOutId = setTimeout(() => newTransactionStore.checkIfExistsTransaction(productName, transactionDate), 500);
            return () => clearTimeout(timeOutId);
        }, [newTransactionStore, productName, transactionDate]);

        const resetForm = () => {
            setProductPrice('');
            setProductId('');
            customerStore.setSelected(new Customer('-1', '', ''));
        };

        const handleproductIdChange = (id: string): void => {
            setProductId(id.toUpperCase());
        };

        const handleConfirmation = () => {
            if (customerStore.selectedCustomer) {
                setOpenConfirmationDialog(true);
            }
        };

        const handleHasConfirmed = () => {
            newTransactionStore.addTransaction(
                new Product(productName),
                new Transaction(customerStore.selectedCustomer!.ID, transactionDate!, Number(productPrice))
            );
            customerStore.loadAllCustomers();
            resetForm();
        };

        const handleTransactionDateChange = (date: Date) => {
            setTransactionDate(date);
            newTransactionStore.checkIfExistsTransaction(productName, transactionDate);
        };

        const productIdValidationMessage: JSX.Element = newTransactionStore.doesTransactionExistForProductName ? (
            <span style={{ color: 'red' }}>Podany numer produktu już istnieje dla tej daty</span>
        ) : (
            <></>
        );

        return (
            <Container>
                {customerStore.selectedCustomer ? (
                    <TransactionConfirmation
                        open={openConfirmationDialog}
                        setOpen={setOpenConfirmationDialog}
                        transactionDate={transactionDate}
                        productId={productName}
                        clientSelected={customerStore.selectedCustomer}
                        productPrice={productPrice}
                        handleHasConfirmed={handleHasConfirmed}
                    />
                ) : null}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <form className={classes.root} noValidate>
                        <div>
                            <DatePicker date={transactionDate} handleDateChange={handleTransactionDateChange} />
                        </div>
                        <div>
                            <ProductName productName={productName} handleProductNameChange={handleproductIdChange} />
                            {newTransactionStore.checkingIfTransactionExistsForProductName ? <CircularProgress size={19} /> : productIdValidationMessage}
                        </div>
                        <div>
                            <ClientSelect />
                        </div>
                        <div>
                            <PriceInput productPrice={productPrice} handleProductPriceChange={setProductPrice} />
                        </div>
                        <div>
                            <Button variant="contained" size="large" className={classes.submitButton} onClick={handleConfirmation}>
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
