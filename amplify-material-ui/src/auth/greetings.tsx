import * as React from 'react';
import clsx from 'clsx';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Divider,
    createStyles,
    Theme,
    makeStyles,
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import Auth from '@aws-amplify/auth';

import { AuthContext } from './auth-context';
import { AuthComponent, AuthProps } from './types';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            paddingRight: 24,
        },
        title: {
            flexGrow: 1,
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
    }),
);

export interface GreetingsProps extends AuthProps {
    renderUserMenu?: () => React.ReactElement<any>;
    title?: string;
    className?: string;
}

export const Greetings: AuthComponent<GreetingsProps> = props => {
    const { className, renderUserMenu, title = 'Greetings' } = props;

    const { authData } = React.useContext(AuthContext) as AuthProps;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const classes = useStyles();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = async () => {
        handleClose();
        await Auth.signOut();
    };

    return (
        <AppBar position="absolute" className={clsx(classes.appBar, className)}>
            <Toolbar className={classes.toolbar}>
                <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    className={classes.title}
                >
                    {title}
                </Typography>
                <IconButton
                    color="inherit"
                    aria-controls="user-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <AccountCircle />
                </IconButton>
            </Toolbar>
            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem disabled>Angemeldet als {authData.username}</MenuItem>
                <Divider />
                {renderUserMenu && renderUserMenu()}
                <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
        </AppBar>
    );
};
