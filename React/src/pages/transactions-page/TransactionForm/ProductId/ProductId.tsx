import { TextField } from '@material-ui/core';
import React from 'react';

interface IProps {
    productName: string;
    handleProductNameChange(id: string): void;
}

const ProductName: React.FC<IProps> = (props: IProps): JSX.Element => {
    return (
        <TextField
            id="standard-basic"
            value={props.productName}
            onChange={(e) => props.handleProductNameChange(e.target.value)}
            autoComplete="off"
            label="Numer produktu"
        />
    );
};

export default ProductName;
