import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormGroup from '@material-ui/core/FormGroup';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Customer from '../../../../../models/Customer';

interface IProps {
    open: boolean;
    setOpen(open: boolean): void;
    addNewCustomer(user: Customer): void;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(1),
            width: '100%',
        },
        rightButton: {
            textAlign: 'right',
        },
    })
);

const ClientAdder: React.FC<IProps> = (props: IProps): JSX.Element => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles();
    const [state, setState] = useState({
        id: 'noid',
        firstName: '',
        lastName: '',
    });

    const handleClose = () => {
        props.setOpen(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [event.target.id]: event.target.value });
    };

    const handleConfirmation = async () => {
        const { id, firstName, lastName } = state;
        props.addNewCustomer(new Customer(id, firstName, lastName));
        props.setOpen(false);
    };

    return (
        <Dialog fullScreen={fullScreen} open={props.open} onClose={handleClose} aria-labelledby="responsive-dialog-title" maxWidth="sm" fullWidth>
            <DialogTitle id="responsive-dialog-title">Dodaj nowego klienta</DialogTitle>
            <DialogContent>
                <FormGroup className={classes.root}>
                    <Grid container style={{ gridGap: theme.spacing(3) }}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField required id="firstName" label="Imię" defaultValue="" fullWidth onChange={handleChange} autoComplete="off" />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField required id="lastName" label="Nazwisko" defaultValue="" fullWidth onChange={handleChange} autoComplete="off" />
                        </Grid>
                    </Grid>
                    <Grid justify="space-between" container style={{ paddingTop: '20px' }}>
                        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                            <Button autoFocus onClick={handleClose} variant="outlined" color="secondary" size="large">
                                Anuluj
                            </Button>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={6} xl={6} className={classes.rightButton}>
                            <Button variant="outlined" color="primary" onClick={handleConfirmation} autoFocus type="submit" size="large">
                                Dodaj
                            </Button>
                        </Grid>
                    </Grid>
                </FormGroup>
            </DialogContent>
        </Dialog>
    );
};

export default ClientAdder;
