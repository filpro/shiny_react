import { Menu, MenuItem, MenuProps } from '@material-ui/core';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { observer } from 'mobx-react';
import React from 'react';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Delete from '@material-ui/icons/Delete';
import withTranslate, { WithTranslateProps } from '../../../../infrastructure/internationalization/hoc/WithTranslate';
import Translations from '../../../../infrastructure/internationalization/Translations';

export const useItemIconStyles = makeStyles(() =>
    createStyles({
        iconRed: {
            color: 'rgba(255,0,0,0.5)',
        },
        iconGreen: {
            color: 'rgba(0,128,0,0.5)',
        },
    })
);

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

const ItemMenu = observer(
    (props: IItemMenuProps & WithTranslateProps): JSX.Element => {
        const classes = useItemIconStyles();
        return (
            <StyledMenu id="customized-menu" anchorEl={props.anchorEl} keepMounted open={Boolean(props.anchorEl)} onClose={props.handleClose} variant="menu">
                <StyledMenuItem onClick={props.handleDeliveryStatusChange}>
                    <ListItemIcon className={classes[props.deliveryStatusIconClass]}>
                        <ArrowForward />
                        {props.deliveryStatusIcon}
                    </ListItemIcon>
                    <ListItemText primary={`${props.translate(Translations.SearchTransaction.TransactionsList.MarkAs)} ${props.deliveryStatusLabel}`} />
                </StyledMenuItem>
                <StyledMenuItem onClick={props.handlePaymentStatusChange}>
                    <ListItemIcon className={classes[props.paymentStatusIconClass]}>
                        <ArrowForward />
                        {props.paymentStatusIcon}
                    </ListItemIcon>
                    <ListItemText primary={`${props.translate(Translations.SearchTransaction.TransactionsList.MarkAs)} ${props.paymentStatusLabel}`} />
                </StyledMenuItem>
                <StyledMenuItem onClick={props.handleDeleteTransaction}>
                    <ListItemIcon>
                        <ArrowForward />
                        <Delete />
                    </ListItemIcon>
                    <ListItemText primary={props.translate(Translations.SearchTransaction.TransactionsList.Delete).toUpperCase()} />
                </StyledMenuItem>
            </StyledMenu>
        );
    }
);

export default withTranslate(ItemMenu);
