import {
    createStyles,
    makeStyles,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Grid,
    Tooltip,
    MenuProps,
    Zoom,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { FixedSizeList as List } from 'react-window';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import RemoveShoppingCart from '@material-ui/icons/RemoveShoppingCart';
import AttachMoney from '@material-ui/icons/AttachMoney';
import MoneyOff from '@material-ui/icons/MoneyOff';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Delete from '@material-ui/icons/Delete';
import InspectTransactionStore from '../../../stores/TransactionInspect.Store';

const useStyles = makeStyles(() =>
    createStyles({
        Card: {
            padding: '5px',
            border: '1px solid #d9dddd',
            transition: 'all 500ms ease-in-out',
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

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props: MenuProps) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles(() => ({
    root: {},
}))(MenuItem);

const statusProperties = {
    payment: [
        {
            class: 'iconRed',
            message: 'NIEOPŁACONE',
            icon: <MoneyOff className="iconRed" />,
        },
        {
            class: 'iconGreen',
            message: 'OPŁACONE',
            icon: <AttachMoney className="iconGreen" />,
        },
    ],
    delivery: [
        {
            class: 'iconRed',
            message: 'NIEWYSŁANE',
            icon: <RemoveShoppingCart className="iconRed" />,
        },
        {
            class: 'iconGreen',
            message: 'WYSŁANE',
            icon: <ShoppingCart className="iconGreen" />,
        },
    ],
};

interface IItemMenuProps {
    anchorEl: null | HTMLElement;
    handleDeliveryStatusChange(): void;
    handlePaymentStatusChange(): void;
    handleDeleteTransaction(): void;
    handleClose(): void;
    isPaid?: boolean;
    paymentStatusLabel: string;
    paymentStatusIcon: JSX.Element;
    paymentStatusIconClass: string;
    isDelivered?: boolean;
    deliveryStatusLabel: string;
    deliveryStatusIcon: JSX.Element;
    deliveryStatusIconClass: string;
}

const ItemMenu = observer(
    (props: IItemMenuProps): JSX.Element => {
        const classes = useStyles();

        return (
            <StyledMenu id="customized-menu" anchorEl={props.anchorEl} keepMounted open={Boolean(props.anchorEl)} onClose={props.handleClose} variant="menu">
                <StyledMenuItem onClick={props.handleDeliveryStatusChange}>
                    <ListItemIcon className={classes[props.deliveryStatusIconClass]}>
                        <ArrowForward />
                        {props.deliveryStatusIcon}
                    </ListItemIcon>
                    <ListItemText primary={`Oznacz jako ${props.deliveryStatusLabel}`} />
                </StyledMenuItem>
                <StyledMenuItem onClick={props.handlePaymentStatusChange}>
                    <ListItemIcon className={classes[props.paymentStatusIconClass]}>
                        <ArrowForward />
                        {props.paymentStatusIcon}
                    </ListItemIcon>
                    <ListItemText primary={`Oznacz jako ${props.paymentStatusLabel}`} />
                </StyledMenuItem>
                <StyledMenuItem onClick={props.handleDeleteTransaction}>
                    <ListItemIcon>
                        <ArrowForward />
                        <Delete />
                    </ListItemIcon>
                    <ListItemText primary="Usuń" />
                </StyledMenuItem>
            </StyledMenu>
        );
    }
);

const Row = observer(
    ({ index, style, data }): JSX.Element => {
        const classes = useStyles();
        const inspectTransactionsStore = useContext(InspectTransactionStore);
        const transaction = data[index];
        const customer = inspectTransactionsStore?.getLocalFilteredCustomerById(transaction.CUSTOMER_ID);
        const product = inspectTransactionsStore?.getLocalFilteredProductById(transaction.PRODUCT_ID);
        const [checked] = React.useState(true);

        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
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

        const handleDeleteTransaction = () => {
            inspectTransactionsStore.deleteTransaction(transaction);
            handleClose();
        };

        const boolToInt = (x: boolean | undefined) => (x ? 1 : 0);
        const paymentStatusProperties = statusProperties.payment[boolToInt(transaction.IS_PAID)];
        const deliveryStatusProperties = statusProperties.delivery[boolToInt(transaction.IS_DELIVERED)];

        return (
            <div style={style}>
                <Zoom in={checked}>
                    <Card className={`${classes.Card}`}>
                        <ItemMenu
                            anchorEl={anchorEl}
                            handleDeliveryStatusChange={handleDeliveryStatusChange}
                            handlePaymentStatusChange={handlePaymentStatusChange}
                            handleDeleteTransaction={handleDeleteTransaction}
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
                            title={`${product?.PRODUCT_NAME}`}
                            subheader={`${transaction.TRANSMISSION_ID}`}
                            key={index}
                        />
                        <CardContent>
                            <Grid container direction="row" justify="space-between">
                                <Grid item className={classes.textCardGrid}>
                                    <Typography color="textSecondary" noWrap>{`${customer?.FIRST_NAME} ${customer?.LAST_NAME}`}</Typography>
                                    <Typography color="textSecondary">{transaction.PRODUCT_PRICE}</Typography>
                                </Grid>
                                <Grid item>
                                    <Tooltip title={deliveryStatusProperties.message}>
                                        <div className={classes[deliveryStatusProperties.class]}>{deliveryStatusProperties.icon} </div>
                                    </Tooltip>
                                    <Tooltip title={paymentStatusProperties.message}>
                                        <div className={classes[paymentStatusProperties.class]}>{paymentStatusProperties.icon} </div>
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

const ItemList = observer(
    (): JSX.Element => {
        const inspectTransactionsStore = useContext(InspectTransactionStore);

        return inspectTransactionsStore.localFilteredTransactions !== undefined ? (
            <List
                height={500}
                itemCount={inspectTransactionsStore.localFilteredTransactions.length}
                itemSize={200}
                itemData={inspectTransactionsStore.localFilteredTransactions}
                width="100%"
            >
                {Row}
            </List>
        ) : (
            <>Wczytuję</>
        );
    }
);

export default ItemList;
