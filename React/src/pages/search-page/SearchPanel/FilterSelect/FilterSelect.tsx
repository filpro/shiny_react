import { TextField, useTheme } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { VariableSizeList as List, ListChildComponentProps } from 'react-window';
import ListSubheader from '@material-ui/core/ListSubheader';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import InspectTransactionStore from '../../../../stores/TransactionInspect.Store';

interface IProps<T> {
    label: string;
    optionLabel(option: T): string;
    renderOption(option: T): JSX.Element;
    options: T[] | undefined;
    changeHandler(value: T[] | [], reason: string): void;
    filter: T[] | undefined;
}

function renderRow(props: ListChildComponentProps) {
    const { data, index, style } = props;
    // return <div style={style}>{data[index]}</div>;
    return React.cloneElement(data[index], {
        style: {
            ...style,
        },
    });
}

const OuterElementContext = React.createContext({});
const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

const LISTBOX_PADDING = 8;

const ListboxComponent = React.forwardRef<HTMLDivElement>(
    (props, ref): JSX.Element => {
        const { children, ...other } = props;
        const theme = useTheme();
        const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
        const itemSize = smUp ? 36 : 48;
        const itemData = React.Children.toArray(children);
        const itemCount = itemData.length;

        const getChildSize = (child: React.ReactNode) => {
            if (React.isValidElement(child) && child.type === ListSubheader) {
                return 48;
            }
            return itemSize;
        };

        const getHeight = () => {
            if (itemCount > 8) {
                return 8 * itemSize;
            }
            return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
        };

        return itemData !== undefined ? (
            <div ref={ref}>
                <OuterElementContext.Provider value={other}>
                    <List
                        height={getHeight() + 2 * LISTBOX_PADDING}
                        itemCount={itemCount}
                        itemSize={(index) => getChildSize(itemData[index])}
                        itemData={itemData}
                        width="100%"
                        overscanCount={5}
                        outerElementType={OuterElementType}
                        innerElementType="ul"
                    >
                        {renderRow}
                    </List>
                </OuterElementContext.Provider>
            </div>
        ) : (
            <>Wczytuję</>
        );
    }
);

const FilterSelect = observer(
    <T,>(props: IProps<T>): JSX.Element => {
        const inspectTransactionsStore = useContext(InspectTransactionStore);

        const changeHandler = (value: T[] | [], reason: string) => {
            props.changeHandler(value, reason);
        };

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
                    getOptionLabel={props.optionLabel}
                    value={props.filter || []}
                    onChange={(_, newValue, reason) => changeHandler(newValue, reason)}
                    renderInput={(params) => <TextField {...params} label={props.label} fullWidth />}
                    renderOption={props.renderOption}
                    noOptionsText="Brak możliwych opcji"
                    disableListWrap
                    ListboxComponent={ListboxComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
                />
            </>
        );
    }
);

export default FilterSelect;
