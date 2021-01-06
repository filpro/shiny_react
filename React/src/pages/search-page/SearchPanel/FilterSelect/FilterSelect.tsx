import { TextField, Divider } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import InspectTransactionStore from '../../../../stores/TransactionInspect.Store';

interface IProps<T> {
    label: string;
    optionLabel(option: T): string;
    renderOption(option: T): JSX.Element;
    options: T[] | undefined;
    changeHandler(value: T[] | []): void;
    filter: T[] | undefined;
}

const FilterSelect = observer(
    <T,>(props: IProps<T>): JSX.Element => {
        const inspectTransactionsStore = useContext(InspectTransactionStore);

        return inspectTransactionsStore.serverFilteredCustomers === null ? (
            <></>
        ) : (
            <>
                <Autocomplete
                    size="small"
                    id="combo-box-demo"
                    multiple
                    filterSelectedOptions
                    options={props.options || []}
                    //getOptionLabel={(option) => (option === null ? '' : `${option.FIRST_NAME} ${option.LAST_NAME}`)}
                    getOptionLabel={props.optionLabel}
                    value={props.filter || []}
                    onChange={(_, newValue) => props.changeHandler(newValue)}
                    renderInput={(params) => <TextField {...params} label={props.label} fullWidth />}
                    renderOption={props.renderOption}
                    ListboxProps={{
                        style: {
                            maxHeight: '150px',
                            border: '1px solid black',
                            fontSize: 'small',
                        },
                    }}
                />
            </>
        );
    }
);

export default FilterSelect;
