import React, { useContext } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { observer } from 'mobx-react';
import classes from './Mytable.module.css';
import InspectTransactionStore from '../../stores/TransactionInspect.Store';
import Transaction from '../../models/Transaction';

const DenseTable: React.FC = observer(
    (): JSX.Element => {
        const inspectTransactionsStore = useContext(InspectTransactionStore);
        const data = inspectTransactionsStore.localFilteredTransactions;
        console.log(data);
        const outputTable =
            data !== undefined ? (
                <TableContainer component={Paper}>
                    <Table className={classes.mytable} size="small" aria-label="a dense table">
                        <TableBody>
                            {data.map((row: Transaction) => (
                                <TableRow key={row.ID}>
                                    {Object.keys(row).map((col: string) => {
                                        if (col === 'ID') {
                                            return (
                                                <TableCell key={col} component="th" scope="row">
                                                    {row.ID}
                                                </TableCell>
                                            );
                                        }
                                        return (
                                            <TableCell key={col} align="right">
                                                {row[col]}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : null;

        return <div>{outputTable}</div>;
    }
);

export default DenseTable;
