import { TextField } from '@material-ui/core';
import React from 'react';

interface IProps {
    value: string;
    changeHandler(x: string): void;
}

const PriceInput: React.FC<IProps> = (props: IProps): JSX.Element => {
    return (
        <TextField
            autoComplete="off"
            id="filled-number"
            label="Cena"
            type="number"
            value={props.value}
            onChange={(e) => props.changeHandler(e.target.value)}
            InputLabelProps={{
                shrink: true,
            }}
        />
    );
};

export default PriceInput;
