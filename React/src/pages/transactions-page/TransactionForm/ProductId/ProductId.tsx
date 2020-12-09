import { TextField } from '@material-ui/core';
import React from 'react';

interface IProps {
    productId: string;
    handleProductIdChange(id: string): void;
}

const ProductId: React.FC<IProps> = (props: IProps): JSX.Element => {
    return (
        <TextField
            id="standard-basic"
            value={props.productId}
            onChange={(e) => props.handleProductIdChange(e.target.value)}
            autoComplete="off"
            label="Numer produktu"
        />
    );
};

export default ProductId;
