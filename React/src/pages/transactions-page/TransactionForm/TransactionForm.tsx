import { makeStyles, Theme, createStyles, Grid } from '@material-ui/core';
import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import { observer } from 'mobx-react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClientSelect from './ClientSelect/ClientSelect';
import DatePicker from './DatePicker/DatePicker';
import PriceInput from './PriceInput/PriceInput';
import ProductName from './ProductName/ProductName';
import TransactionConfirmation from './TransactionConfirmation/TransactionConfirmation';
import CustomerStore from '../../../stores/Customer.Store';
import NewTransactionStore from '../../../stores/NewTransaction.Store';

import Transaction from '../../../models/Transaction';
import Product from '../../../models/Product';
import withTranslate, { WithTranslateProps } from '../../../infrastructure/internationalization/hoc/WithTranslate';
import Translations from '../../../infrastructure/internationalization/Translations';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                marginTop: theme.spacing(1),
                marginBottom: theme.spacing(1),
                width: '100%',
            },
        },
        submitButton: {
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(3),
            width: '100%',
            backgroundColor: 'rgba(221,221,221,1)',
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    })
);

const TransactionForm: React.FC<WithTranslateProps> = observer(
    (props: WithTranslateProps): JSX.Element => {
        const classes = useStyles();
        const customerStore = useContext(CustomerStore);
        const newTransactionStore = useContext(NewTransactionStore);
        const [openConfirmationDialog, setOpenConfirmationDialog] = React.useState(false);

        const resetForm = () => {
            newTransactionStore.setNewProductPrice('');
            newTransactionStore.setNewProductName('');
            customerStore.setSelected(null);
        };

        const handleProductNameChange = (id: string): void => {
            newTransactionStore.setNewProductName(id.toUpperCase());
        };

        const handleConfirmation = () => {
            if (customerStore.selectedCustomer && !newTransactionStore.doesTransactionExistForProductName) {
                setOpenConfirmationDialog(true);
            }
        };

        const handleHasConfirmed = () => {
            newTransactionStore.addTransaction(
                new Product(newTransactionStore.newProductName),
                new Transaction(customerStore.selectedCustomer!.ID, newTransactionStore.newTransactionDate!, Number(newTransactionStore.newProductPrice))
            );
            customerStore.loadAllCustomers();
            resetForm();
        };
        const handleTransactionDateChange = (date: Date) => {
            newTransactionStore.setNewTransactionDate(date);
        };

        const productIdValidationMessage: JSX.Element = newTransactionStore.doesTransactionExistForProductName ? (
            <span style={{ color: 'red' }}>{props.translate(Translations.NewTransaction.ProductExistsWarning)}</span>
        ) : (
            <></>
        );

        return (
            <>
                {openConfirmationDialog ? (
                    <TransactionConfirmation
                        open={openConfirmationDialog}
                        setOpen={setOpenConfirmationDialog}
                        transactionDate={newTransactionStore.newTransactionDate}
                        productId={newTransactionStore.newProductName}
                        clientSelected={customerStore.selectedCustomer}
                        productPrice={newTransactionStore.newProductPrice}
                        handleHasConfirmed={handleHasConfirmed}
                    />
                ) : null}
                <Backdrop className={classes.backdrop} open={newTransactionStore.isAdding}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                    <form className={classes.root} onSubmit={handleConfirmation}>
                        <DatePicker date={newTransactionStore.newTransactionDate} handleDateChange={handleTransactionDateChange} />
                        <ProductName
                            productName={newTransactionStore.newProductName}
                            handleProductNameChange={handleProductNameChange}
                            isInvalid={newTransactionStore.doesTransactionExistForProductName}
                            isChecking={newTransactionStore.checkingIfTransactionExistsForProductName}
                        />
                        {newTransactionStore.checkingIfTransactionExistsForProductName ? '' : productIdValidationMessage}
                        <ClientSelect wait={newTransactionStore.isLoading} />
                        <PriceInput productPrice={newTransactionStore.newProductPrice} handleProductPriceChange={newTransactionStore.setNewProductPrice} />
                        <Button variant="contained" type="submit" size="large" className={classes.submitButton}>
                            {props.translate(Translations.NewTransaction.Sold)}
                        </Button>
                    </form>
                </Grid>
            </>
        );
    }
);

export default React.memo(withTranslate(TransactionForm));
