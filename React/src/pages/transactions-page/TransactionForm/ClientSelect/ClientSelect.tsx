/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button, Divider } from '@material-ui/core';
import ClientAdder from './ClientAdder/ClientAdder';
import Customer from '../../../../models/Customer';

interface IProps {
    value: any;
    setValue(user: { title: string; year: number } | undefined): void;
    options: any;
    setOptions(x: any): void;
    expandOptions(x: Customer): void;
    inputValue: any;
    setInputValue(x: any): void;
}

const ClientSelect: React.FC<IProps> = (props: IProps): JSX.Element => {
    const [open, setOpen] = React.useState(false);

    const newClientHandler = (): void => {
        setOpen(true);
    };

    return (
        <div>
            <ClientAdder open={open} setOpen={setOpen} setSelected={props.expandOptions} />
            <Autocomplete
                size="small"
                id="combo-box-demo"
                options={props.options}
                getOptionLabel={(option) => option.title}
                value={props.value}
                onChange={(_, newValue) => props.setValue(newValue)}
                inputValue={props.inputValue}
                onInputChange={(_, newValue) => props.setInputValue(newValue)}
                // eslint-disable-next-line @typescript-eslint/ban-types
                // onInputChange={(event: object, value: string) => props.handleClientSelectionChange(value)}
                renderInput={(params) => <TextField {...params} label="Nazwa klienta" fullWidth />}
                renderOption={(option) => {
                    return (
                        <>
                            <div>
                                {option.title}
                                <Divider />
                            </div>
                        </>
                    );
                }}
                noOptionsText={<Button onMouseDown={() => newClientHandler()}>Dodaj nowego klienta</Button>}
                ListboxProps={{
                    style: {
                        maxHeight: '150px',
                        border: '1px solid black',
                        fontSize: 'small',
                    },
                }}
            />
        </div>
    );
};

export default ClientSelect;
