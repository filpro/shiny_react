import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import React from 'react';
import withTranslate, { WithTranslateProps } from '../../../../infrastructure/internationalization/hoc/WithTranslate';
import Translations from '../../../../infrastructure/internationalization/Translations';
import Product from '../../../../models/Product';
import Transaction from '../../../../models/Transaction';

interface IProps {
    open: boolean;
    handleDeletionConfirmation(decision: boolean): void;
    product: Product | undefined;
    transaction: Transaction | undefined;
}

const DeleteConfirmation: React.FC<IProps & WithTranslateProps> = (props: IProps & WithTranslateProps): JSX.Element => {
    return (
        <Dialog
            open={props.open}
            onClose={() => props.handleDeletionConfirmation(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
        >
            <DialogTitle id="alert-dialog-title">{props.translate(Translations.SearchTransaction.TransactionsList.DeleteConfirmation.Title)}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {`${props.translate(Translations.SearchTransaction.TransactionsList.DeleteConfirmation.Description)} ${props.product?.PRODUCT_NAME} (${
                        props.transaction?.TRANSMISSION_ID
                    })`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.handleDeletionConfirmation(false)} color="primary" autoFocus>
                    {props.translate(Translations.SearchTransaction.TransactionsList.DeleteConfirmation.No)}
                </Button>
                <Button onClick={() => props.handleDeletionConfirmation(true)} color="primary">
                    {props.translate(Translations.SearchTransaction.TransactionsList.DeleteConfirmation.Yes)}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default withTranslate(DeleteConfirmation);
