import { TextField } from '@material-ui/core';
import React from 'react';

const ProductId: React.FC = (): JSX.Element => {
    return <TextField id="standard-basic" autoComplete="off" label="Numer produktu" inputProps={{ style: { textTransform: 'uppercase' } }} />;
};

export default ProductId;
