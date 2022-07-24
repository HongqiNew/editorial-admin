import { useUser } from "@auth0/nextjs-auth0";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AppBar, Box, IconButton, Toolbar, Typography, useTheme } from "@mui/material";
import React from "react";
import WestIcon from '@mui/icons-material/West';
import router from "next/router";

const LayoutBar = () => {
    const user = useUser().user;
    return (
        <AppBar
            position='fixed'
            sx={{
                width: '100%',
            }}
        >
            <Toolbar>
                <IconButton sx={{ mr: 2 }} onClick={() => router.back()}>
                    <WestIcon></WestIcon>
                </IconButton>
                <Typography variant='h6'>
                    《新红旗》后台
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                    size='large'
                    onClick={user ? () => router.push('/api/auth/logout') : () => router.push('/api/auth/login')}
                >
                    {
                        user
                            ?
                            <img src={user.picture as string} style={{
                                borderRadius: 50,
                                maxHeight: 48,
                                width: 'auto'
                            }}></img>
                            :
                            <AccountCircleIcon htmlColor='pink' />
                    }
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default LayoutBar;
