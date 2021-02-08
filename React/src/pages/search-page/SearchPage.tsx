import { makeStyles, Theme, createStyles, Grid } from '@material-ui/core';
import React from 'react';
import SearchPanel from './SearchPanel/SearchPanel';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // margin: `${theme.spacing(2)}px auto`,
            width: '100%',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            flexBasis: '33.33%',
            flexShrink: 0,
        },
        secondaryHeading: {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
    })
);

const SearchPage: React.FC = (): JSX.Element => {
    const classes = useStyles();
    return (
        <div>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.root}>
                <SearchPanel />
            </Grid>
        </div>
    );
};

export default SearchPage;
