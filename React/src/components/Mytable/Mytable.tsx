import React, { useContext } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { observer } from 'mobx-react';
import classes from './Mytable.module.css';
import NewCustomerStore from '../../stores/NewCustomer.Store';
import Customer from '../../models/Customer';

const DenseTable: React.FC = observer(
    (): JSX.Element => {
        const newCustomerStore = useContext(NewCustomerStore);
        const data = newCustomerStore.allCustomers;

        const outputTable =
            data !== undefined ? (
                <TableContainer component={Paper}>
                    <Table className={classes.mytable} size="small" aria-label="a dense table">
                        <TableBody>
                            {data.map((row: Customer) => (
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
