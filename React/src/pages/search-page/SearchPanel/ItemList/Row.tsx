import { createStyles, makeStyles, Typography, Card, CardContent, CardHeader, Avatar, IconButton, Grid, Tooltip, Zoom } from '@material-ui/core';
import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import RemoveShoppingCart from '@material-ui/icons/RemoveShoppingCart';
import AttachMoney from '@material-ui/icons/AttachMoney';
import MoneyOff from '@material-ui/icons/MoneyOff';
import InspectTransactionStore from '../../../../stores/TransactionInspect.Store';
import withTranslate from '../../../../infrastructure/internationalization/hoc/WithTranslate';
import Translations from '../../../../infrastructure/internationalization/Translations';
import ItemMenu, { useItemIconStyles } from './ItemMenu';
import DeleteConfirmation from './DeleteConfirmation';
import dateDiffInDays from '../../../../utils/DateDiffInDays';

const useItemStyles = makeStyles(() =>
    createStyles({
        Card: {
            padding: '5px',
            border: '1px solid #d9dddd',
            transition: 'all 500ms ease-in-out',
            backgroundColor: 'rgba(228,228,228,0.1)',
        },
        textCardGrid: {
            flexWrap: 'wrap',
            width: '70%',
        },
        iconRed: {
            color: 'rgba(255,0,0,0.5)',
        },
        iconGreen: {
            color: 'rgba(0,128,0,0.5)',
        },
    })
);

const Row = observer(
    ({ index, style, data, ...props }): JSX.Element => {
        const classes = useItemStyles();
        const iconClasses = useItemIconStyles();
        const inspectTransactionsStore = useContext(InspectTransactionStore);
        const transaction = data[index];
        const customer = inspectTransactionsStore?.getLocalFilteredCustomerById(transaction.CUSTOMER_ID);
        const product = inspectTransactionsStore?.getLocalFilteredProductById(transaction.PRODUCT_ID);
        const [checked] = React.useState(true);
        const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setOpenDeleteConfirmation(false);
            setAnchorEl(null);
        };

        const handleDeliveryStatusChange = () => {
            const updatedTransaction = { ...transaction };
            updatedTransaction.IS_DELIVERED = !transaction.IS_DELIVERED;
            inspectTransactionsStore.updateTransaction(updatedTransaction);
            handleClose();
        };

        const handlePaymentStatusChange = () => {
            const updatedTransaction = { ...transaction };
            updatedTransaction.IS_PAID = !transaction.IS_PAID;
            inspectTransactionsStore.updateTransaction(updatedTransaction);
            handleClose();
        };

        const openDeleteConfirmationDialog = () => {
            setOpenDeleteConfirmation(true);
        };

        const handleDeleteTransaction = (decision: boolean) => {
            setOpenDeleteConfirmation(false);
            if (decision) inspectTransactionsStore.deleteTransaction(transaction);
            handleClose();
        };

        const intervalMessage = (date1: any, date2: any) => {
            const result = dateDiffInDays(date1, date2);
            // eslint-disable-next-line no-nested-ternary
            const resultText = result === 0 ? 'dzisiaj' : result === 1 ? 'wczoraj' : result === 2 ? 'przedwczoraj' : `${result} dni temu`;
            return resultText;
        };

        const statusProperties = {
            payment: [
                {
                    class: 'iconRed',
                    message: props.translate(Translations.SearchTransaction.TransactionsList.Unpaid).toUpperCase(),
                    icon: <MoneyOff className="iconRed" />,
                },
                {
                    class: 'iconGreen',
                    message: props.translate(Translations.SearchTransaction.TransactionsList.Paid).toUpperCase(),
                    icon: <AttachMoney className="iconGreen" />,
                },
            ],
            delivery: [
                {
                    class: 'iconRed',
                    message: props.translate(Translations.SearchTransaction.TransactionsList.Unsent).toUpperCase(),
                    icon: <RemoveShoppingCart className="iconRed" />,
                },
                {
                    class: 'iconGreen',
                    message: props.translate(Translations.SearchTransaction.TransactionsList.Sent).toUpperCase(),
                    icon: <ShoppingCart className="iconGreen" />,
                },
            ],
        };

        const boolToInt = (x: boolean | undefined) => (x ? 1 : 0);
        const paymentStatusProperties = statusProperties.payment[boolToInt(transaction.IS_PAID)];
        const deliveryStatusProperties = statusProperties.delivery[boolToInt(transaction.IS_DELIVERED)];
        return (
            <div style={style}>
                <DeleteConfirmation
                    transaction={transaction}
                    product={product}
                    open={openDeleteConfirmation}
                    handleDeletionConfirmation={handleDeleteTransaction}
                />
                <Zoom in={checked}>
                    <Card className={`${classes.Card}`}>
                        <ItemMenu
                            anchorEl={anchorEl}
                            handleDeliveryStatusChange={handleDeliveryStatusChange}
                            handlePaymentStatusChange={handlePaymentStatusChange}
                            handleDeleteTransaction={openDeleteConfirmationDialog}
                            handleClose={handleClose}
                            deliveryStatusLabel={statusProperties.delivery[boolToInt(!transaction.IS_DELIVERED)].message}
                            deliveryStatusIcon={statusProperties.delivery[boolToInt(!transaction.IS_DELIVERED)].icon}
                            deliveryStatusIconClass={statusProperties.delivery[boolToInt(!transaction.IS_DELIVERED)].class}
                            paymentStatusLabel={statusProperties.payment[boolToInt(!transaction.IS_PAID)].message}
                            paymentStatusIcon={statusProperties.payment[boolToInt(!transaction.IS_PAID)].icon}
                            paymentStatusIconClass={statusProperties.payment[boolToInt(!transaction.IS_PAID)].class}
                        />
                        <CardHeader
                            avatar={<Avatar aria-label="recipe">{`${customer?.FIRST_NAME[0]}${customer?.LAST_NAME[0]}`}</Avatar>}
                            action={
                                <IconButton aria-label="settings" onClick={handleClick}>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            title={`${transaction.TRANSMISSION_ID}`}
                            subheader={`${intervalMessage(transaction.TRANSMISSION_ID, Date())}`}
                            key={index}
                        />
                        <CardContent>
                            <Grid container direction="row" justify="space-between">
                                <Grid item className={classes.textCardGrid}>
                                    <Typography color="textPrimary" noWrap variant="h4">{`${product?.PRODUCT_NAME}`}</Typography>
                                    <Typography color="textPrimary" variant="h6" noWrap>{`${customer?.FIRST_NAME} ${customer?.LAST_NAME}`}</Typography>
                                    <Typography color="textSecondary">
                                        {new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(transaction.PRODUCT_PRICE)}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Tooltip title={deliveryStatusProperties.message}>
                                        <div className={iconClasses[deliveryStatusProperties.class]}>{deliveryStatusProperties.icon} </div>
                                    </Tooltip>
                                    <Tooltip title={paymentStatusProperties.message}>
                                        <div className={iconClasses[paymentStatusProperties.class]}>{paymentStatusProperties.icon} </div>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Zoom>
            </div>
        );
    }
);

export default withTranslate(Row);
