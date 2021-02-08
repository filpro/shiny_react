import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { FixedSizeList as List } from 'react-window';
import InspectTransactionStore from '../../../../stores/TransactionInspect.Store';
import Row from './Row';

const ItemList = observer(
    (): JSX.Element => {
        const inspectTransactionsStore = useContext(InspectTransactionStore);
        const items = inspectTransactionsStore.localFilteredTransactions;
        const itemCount = items ? items.length : 0;
        const itemSize = 200;
        return inspectTransactionsStore.localFilteredTransactions !== undefined ? (
            <List height={Math.min(500, itemCount * itemSize)} itemCount={itemCount} itemSize={200} itemData={items} width="100%">
                {Row}
            </List>
        ) : (
            <>Wczytuję</>
        );
    }
);

export default ItemList;
