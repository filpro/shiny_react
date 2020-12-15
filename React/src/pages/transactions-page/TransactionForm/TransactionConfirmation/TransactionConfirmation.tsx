import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { TableContainer, Table, TableBody, TableRow, TableCell, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '100%',
            },
            '& .MuiDialogActions-root': {
                paddingBorrom: '30px',
            },
        },
        tableCell: {
            fontSize: 'large',
        },
    })
);

interface IProps {
    open: boolean;
    setOpen(open: boolean): void;
    transactionDate: Date | null;
    productId: string;
    clientSelected: any;
    productPrice: string;
}

const TransactionConfirmation: React.FC<IProps> = (props: IProps): JSX.Element => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles();

    const handleClose = () => {
        props.setOpen(false);
    };

    const { FIRST_NAME, LAST_NAME } = props.clientSelected;

    const transactionInfo = [
        { value: props.transactionDate === null ? '' : props.transactionDate.toDateString(), label: 'Data transakcji' },
        { value: props.productId, label: 'ID produktu:' },
        { value: props.clientSelected === null ? '' : `${FIRST_NAME} ${LAST_NAME}`, label: 'Nazwa klienta:' },
        { value: props.productPrice, label: 'Cena:' },
    ];

    const transactionInfoTable: JSX.Element = (
        <TableContainer>
            <Table aria-label="simple table">
                <TableBody>
                    {transactionInfo.map((value, index) => {
                        return (
                            // eslint-disable-next-line react/no-array-index-key
                            <TableRow key={index}>
                                <TableCell component="th" scope="row" className={classes.tableCell}>
                                    {value.label}
                                </TableCell>
                                <TableCell align="right" className={classes.tableCell}>
                                    {value.value}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Dialog fullScreen={fullScreen} open={props.open} onClose={handleClose} aria-labelledby="responsive-dialog-title" maxWidth="sm" fullWidth>
            <DialogTitle id="responsive-dialog-title">Rejestracja transakcji</DialogTitle>
            <DialogContent>{transactionInfoTable}</DialogContent>
            <DialogActions>
                <Grid justify="space-between" container>
                    <Grid item>
                        <Button autoFocus onClick={handleClose} size="large" variant="outlined" color="secondary">
                            Anuluję
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button onClick={handleClose} color="primary" autoFocus size="large" variant="outlined">
                            Potwierdzam
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default TransactionConfirmation;
