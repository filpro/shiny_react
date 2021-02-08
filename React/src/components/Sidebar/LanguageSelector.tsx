import { FormControl, IconButton, Menu, MenuItem, createStyles, makeStyles, Theme } from '@material-ui/core';
import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import Language from '../../infrastructure/internationalization/enums/Language';
import TranslationsStore from '../../infrastructure/internationalization/Translations.Store';
import FlagPoland from '../../images/poland_flag.png';
import FlagUk from '../../images/uk_flag.png';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        imgMenu: {
            paddingRight: '10px',
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        option: {
            fontSize: 15,
            '& > span': {
                marginRight: 10,
                fontSize: 18,
            },
        },
        menuElement: {
            display: 'flex',
            justifyContent: 'center',
        },
    })
);

const LanguageSelector = observer(
    (): JSX.Element => {
        const classes = useStyles();
        const translationStore = useContext(TranslationsStore);
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

        const handleClose = () => {
            setAnchorEl(null);
        };

        const handleChange = (language: Language): void => {
            translationStore.setLanguage(language);
            handleClose();
        };

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
        };

        const options = [
            {
                language: Language.pl,
                flag: FlagPoland,
                label: 'Polski',
            },
            {
                language: Language.en,
                flag: FlagUk,
                label: 'English',
            },
        ];

        return (
            <FormControl className={classes.menuElement}>
                {/* <Select labelId="language-select" id="language-select" value={translationStore.Language} onChange={handleChange}> */}
                <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} size="small">
                    <img src={options.find((option) => option.language === translationStore.Language)?.flag} alt="Logo" height={15} />
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                    {options.map((item) => {
                        return (
                            <MenuItem key={item.language} onClick={() => handleChange(item.language)}>
                                <img src={item.flag} alt="Logo" height={10} className={classes.imgMenu} />
                                <span>{item.label}</span>
                            </MenuItem>
                        );
                    })}
                </Menu>
                {/* </Select> */}
            </FormControl>
        );
    }
);

export default LanguageSelector;
