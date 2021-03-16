import { createStyles, makeStyles, TextField, Theme, useTheme } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { observer } from 'mobx-react';
import React, { useContext, useState } from 'react';
import { VariableSizeList as List, ListChildComponentProps } from 'react-window';
import ListSubheader from '@material-ui/core/ListSubheader';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import InspectTransactionStore from '../../../../stores/TransactionInspect.Store';
import withTranslate, { WithTranslateProps } from '../../../../infrastructure/internationalization/hoc/WithTranslate';
import Translations from '../../../../infrastructure/internationalization/Translations';

interface IProps<T> {
    label: string;
    optionLabel(option: T): string;
    renderOption(option: T): JSX.Element;
    options: T[] | undefined;
    changeHandler(value: T[] | [], reason: string): void;
    filter: T[] | undefined;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        listbox: {
            padding: 0,
        },
        option: {
            minHeight: '0px',
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    })
);

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

const LISTBOX_PADDING = 10;

const ListboxComponent = React.forwardRef<HTMLDivElement>(
    (props, ref): JSX.Element => {
        const { children, ...other } = props;
        const theme = useTheme();
        const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
        const itemSize = smUp ? 25 : 25;
        const itemData = React.Children.toArray(children);
        const itemCount = itemData.length;

        const getChildSize = (child: React.ReactNode) => {
            if (React.isValidElement(child) && child.type === ListSubheader) {
                return 25;
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
                        overscanCount={1}
                        outerElementType={OuterElementType}
                        innerElementType="ul"
                        style={{
                            border: '0.5px solid lightgrey',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                        }}
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
    <T,>(props: IProps<T> & WithTranslateProps): JSX.Element => {
        const inspectTransactionsStore = useContext(InspectTransactionStore);
        const classes = useStyles();

        const [open, setOpen] = useState(false);
        const changeHandler = (value: T[] | [], reason: string) => {
            props.changeHandler(value, reason);
        };

        const openHandler = () => {
            setOpen(true);
        };

        const closeHandler = () => {
            setOpen(false);
        };

        return inspectTransactionsStore.serverFilteredCustomers === null ? (
            <></>
        ) : (
            <>
                <Autocomplete
                    open={open}
                    blurOnSelect
                    onOpen={openHandler}
                    onClose={closeHandler}
                    classes={{
                        option: classes.option,
                        listbox: classes.listbox,
                    }}
                    size="small"
                    id="combo-box-demo"
                    multiple
                    filterSelectedOptions
                    options={props.options || []}
                    getOptionLabel={props.optionLabel}
                    value={props.filter || []}
                    onChange={(_, newValue, reason) => changeHandler(newValue, reason)}
                    renderInput={(params) => <TextField {...params} label={props.label} fullWidth variant="outlined" />}
                    renderOption={props.renderOption}
                    noOptionsText={props.translate(Translations.SearchTransaction.Filters.NoMoreOptions)}
                    disableListWrap
                    ListboxComponent={ListboxComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
                />
            </>
        );
    }
);

export default withTranslate(FilterSelect);
