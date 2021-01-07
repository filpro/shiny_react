import { createStyles, makeStyles, Theme, Typography, Card, CardContent, CardHeader, Avatar, IconButton, CardMedia, CardActionArea } from '@material-ui/core';
import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { FixedSizeList as List } from 'react-window';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InspectTransactionStore from '../../../stores/TransactionInspect.Store';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        Card: {
            padding: '5px',
            border: '1px solid #d9dddd',
        },
        media: {
            height: 0,
            paddingTop: '56.25%', // 16:9
        },
    })
);

const Row = observer(
    ({ index, key, style }): JSX.Element => {
        const classes = useStyles();
        const inspectTransactionsStore = useContext(InspectTransactionStore);
        const transaction = inspectTransactionsStore!.localFilteredTransactions[index];
        return (
            <div style={style}>
                <Card className={`${classes.Card}`}>
                    <CardHeader
                        avatar={<Avatar aria-label="recipe">R</Avatar>}
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                        title={`${transaction.PRODUCT_ID}`}
                        subheader={`${transaction.TRANSMISSION_ID}`}
                        key={key}
                    />
                    <CardMedia image={`https://picsum.photos/seed/${index * 10}/388/698`} title="Contemplative Reptile" className={classes.media} />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {transaction.CUSTOMER_ID}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {transaction.PRODUCT_PRICE}
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        );
    }
);

const ItemList = observer(
    (): JSX.Element => {
        const inspectTransactionsStore = useContext(InspectTransactionStore);

        return inspectTransactionsStore.localFilteredTransactions !== undefined ? (
            <List height={500} itemCount={inspectTransactionsStore.localFilteredTransactions.length} itemSize={525} width="100%">
                {Row}
            </List>
        ) : (
            <>Wczytuję</>
        );
    }
);

export default ItemList;
