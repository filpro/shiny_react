import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Snackbar from '@material-ui/core/Snackbar';

import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import TransactionInspect from '../../stores/TransactionInspect.Store';
import IWindow from '../../utils/IWindow';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

declare let window: IWindow;
//* * Listen to the server, when the data should be updated */
const UpdateTrigger = observer(
    (): JSX.Element => {
        const inspectTransactionsStore = useContext(TransactionInspect);
        const [open, setOpen] = useState(false);
        const [message, setMessage] = useState('');

        const handleClose = () => {
            setOpen(false);
        };

        useEffect(() => {
            window.Shiny.addCustomMessageHandler<string>('refreshDataTrigger', (serverMessage: string) => {
                setMessage(serverMessage);
                inspectTransactionsStore.getServerFilteredData();
                setOpen(true);
            });
        }, [inspectTransactionsStore]);

        return (
            <>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="info">
                        {message}
                    </Alert>
                </Snackbar>
            </>
        );
    }
);

export default UpdateTrigger;
