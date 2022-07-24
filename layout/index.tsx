import { Box, CssBaseline, Toolbar } from "@mui/material";
import { useEffect, useState } from "react";
import LayoutBar from "./bar";
import LayoutHead from "./head";

type LayoutProps = {
    children: React.ReactNode
    title: string
}

const Layout = ({ children, title }: LayoutProps) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    return isMounted ? (
        <>
            <LayoutHead title={title}></LayoutHead>
            <Box sx={{
                display: 'flex',
                overflowX: 'hidden',
            }}>
                <CssBaseline />
                <Box
                    component='main'
                    sx={{
                        width: '100%',
                        minHeight: 'calc(100vh - 76px)'
                    }}
                >
                    <Box sx={{
                        minHeight: 'calc(100vh - 76px)',
                        p: '0 35px'
                    }}>
                        <LayoutBar></LayoutBar>
                        <Toolbar />
                        <br></br>
                        {children}
                        <br></br><br></br>
                    </Box>
                </Box>
            </Box>
        </>
    ) : (<></>);
}

export default Layout;
