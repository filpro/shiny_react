import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IData from '../utils/IData';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

interface IProps {
    data: IData[];
}

const DenseTable: React.FC<IProps> = (props: IProps): JSX.Element => {
    const classes = useStyles();
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableBody>
                    {props.data.map((row: IData) => (
                        <TableRow key={row.name}>
                            {Object.keys(row).map((col: string) => {
                                if (col === 'name') {
                                    return (
                                        <TableCell key={col} component="th" scope="row">
                                            {row.name}
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
    );
};

export default DenseTable;
