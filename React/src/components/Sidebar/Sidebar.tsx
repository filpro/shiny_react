import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link, useLocation } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import { isMobile } from 'react-device-detect';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        drawer: {
            [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
                flexShrink: 0,
            },
        },
        appBar: {
            [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: drawerWidth,
            },
        },
        bottomNavigation: {
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        drawerPaper: {
            width: drawerWidth,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(1),
        },

        applogo: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        stickToBottom: {
            width: '100%',
            position: 'fixed',
            bottom: 0,
        },
        hiddenObject: {
            display: 'none',
        },
    })
);

const routes = [
    { label: 'Transakcja', link: '/transactions', icon: <AddBoxIcon /> },
    { label: 'Wyszukaj', link: '/search', icon: <SearchIcon /> },
    { label: 'Statystyki', link: '/statistics', icon: <DataUsageIcon /> },
];

interface Props {
    window?: () => Window;
    children: JSX.Element;
}

const Sidebar: React.FC<Props> = (props: Props): JSX.Element => {
    const { window } = props;
    const classes = useStyles();
    const currentLocation = useLocation().pathname;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = (open: boolean) => {
        setMobileOpen(open);
    };

    const drawer = (
        <div>
            <div role="presentation" className={`${classes.toolbar} ${classes.applogo}`}>
                <Link to="/dashboard">
                    <HomeIcon style={{ fontSize: 55 }} />
                </Link>
            </div>
            <Divider />
            <List>
                {routes.map((text) => (
                    <ListItem
                        button
                        key={text.link}
                        component={Link}
                        to={text.link}
                        onClick={() => handleDrawerToggle(false)}
                        onKeyDown={() => handleDrawerToggle(false)}
                    >
                        <ListItemIcon>{text.icon}</ListItemIcon>
                        <ListItemText primary={text.label} />
                    </ListItem>
                ))}
            </List>
            <Divider />
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar disableGutters={false}>
                    <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={() => handleDrawerToggle(true)} className={classes.menuButton}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Responsive drawer
                    </Typography>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor="left"
                        open={mobileOpen}
                        onClose={() => handleDrawerToggle(false)}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={`${classes.content}`}>
                <div className={`${classes.toolbar}`} />
                {props.children}
            </main>
        </div>
    );
};

export default Sidebar;
