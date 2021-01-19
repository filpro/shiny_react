import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import TransactionInspect from '../../stores/TransactionInspect.Store';
import IWindow from '../../utils/IWindow';

declare let window: IWindow;

const UpdateTrigger = observer(
    (): JSX.Element => {
        const inspectTransactionsStore = useContext(TransactionInspect);

        useEffect(() => {
            window.Shiny.addCustomMessageHandler<string>('refreshDataTrigger', (message: string) => {
                console.log(message);
                inspectTransactionsStore.getServerFilteredData();
            });
        }, [inspectTransactionsStore]);

        return <></>;
    }
);

export default UpdateTrigger;
