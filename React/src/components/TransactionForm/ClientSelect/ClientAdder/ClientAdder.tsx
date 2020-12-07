import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

interface IProps {
    open: boolean;
    setOpen(open: boolean): void;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '100%',
            },
        },
    })
);

const ClientAdder: React.FC<IProps> = (props: IProps): JSX.Element => {
    const theme = useTheme();
    const classes = useStyles();

    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClose = () => {
        props.setOpen(false);
    };

    return (
        <Dialog fullScreen={fullScreen} open={props.open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
            <DialogTitle id="responsive-dialog-title">Dodaj nowego klienta</DialogTitle>
            <DialogContent>
                <form className={classes.root} noValidate autoComplete="off">
                    <TextField required id="new-first-name" label="Imię" defaultValue="" fullWidth inputProps={{ style: { textTransform: 'uppercase' } }} />
                    <TextField required id="new-last-name" label="Nazwisko" defaultValue="" fullWidth inputProps={{ style: { textTransform: 'uppercase' } }} />
                </form>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose} color="primary">
                    Anuluj
                </Button>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Dodaj
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ClientAdder;
