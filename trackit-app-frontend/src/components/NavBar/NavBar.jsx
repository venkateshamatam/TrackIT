import * as React from 'react';
import { useContext } from "react";
import { AppBar, Toolbar, Typography, Container, Avatar, Tooltip, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AdbIcon from '@mui/icons-material/Adb';
import { deepOrange, grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../contexts/UserContext.js";
import './NavBar.scss'


function ResponsiveAppBar(props) {
    let { user, setUser } = useContext(UserContext);
    const navigate = useNavigate()
    const LogOut = () => {
        // Before logging out, clear token stored in context, navigate to login.
        user.token = "";
        setUser(user);
        navigate(`/login`);
    }

    return (
        <div className="nav-bar">
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <div className='nav-bar-image'>
                            <AdbIcon sx={{ mr: 1, mt: 0.4 }} />
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                onClick={(e) => {
                                    e.preventDefault()
                                    navigate('/home')
                                }}

                                sx={{
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                    cursor: "pointer"
                                }}
                            >
                                TrackIt
                            </Typography>
                        </div>

                        <div className="nav-bar-list">
                            <div className='profile'>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="a"
                                    onClick={(e) => navigate(`/users/profile`, { state: props })}
                                    sx={{
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem',
                                        color: 'inherit',
                                        textDecoration: 'none',
                                        cursor: "pointer"
                                    }}
                                >
                                    Profile
                                </Typography>


                            </div>
                            <div className='icon'>
                                <Tooltip title={user?.userName}>
                                    <Avatar sx={{ bgcolor: deepOrange[500], fontSize: "small" }}>{user ? user?.userName?.charAt(0) : "U"}</Avatar>
                                </Tooltip>
                            </div>
                            <div className='logout'>
                                <Button size="small" sx={{ color: grey[50] }} variant="text" onClick={LogOut}>
                                    <LogoutIcon />
                                </Button>
                            </div>
                        </div>
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    );
}
export default ResponsiveAppBar;