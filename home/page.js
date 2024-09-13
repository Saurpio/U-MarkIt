'use client'

import { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, IconButton, AppBar, Toolbar, TextField, InputBase, Modal, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';


export default function Home() {
    const [showText, setShowText] = useState(false);
    const [open, setOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [itemName, setItemName] = useState('');

    useEffect(() => {
        setTimeout(() => setShowText(true), 500);
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookiesAccepted', true);
        setOpen(false);
    };

    const handleDecline = () => {
        setOpen(false);
    };

    const handleSignInClick = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleSignUp = () => {
        // Handle sign up logic here
        setModalOpen(false);
    };

    return (
        <>
            {/* Header with Umarkit, search bar, and sign-in button */}
            <AppBar position="static" sx={{ backgroundColor: '#ad7339', color: '#FFFFFF' }}>
            <Toolbar>
                    <IconButton edge="end" color="inherit" aria-label="BlurOnIcon" sx={{ mr: 0.1 }}>
                        <BlurOnIcon sx={{ color: 'white' }} />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>U-Mark It</Typography>
                    <SignedOut>
                      {/* Search Bar */}
                    <Box sx={{ flexGrow: 10, display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 2, padding: '0 8px' }}>
                        <SearchIcon sx={{ color: '#000000' }} />
                        <InputBase
                            placeholder="Search items..."
                            sx={{ marginLeft: 1, flex: 1, color: '#000000' }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        {/* Sign In Button */}
                        <Button
                            variant="contained"
                            href="/sign-in"
                            sx={{
                                ml: 4,
                                backgroundColor: '#FFFFFF',
                                color: '#000000',
                                '&:hover': {
                                    backgroundColor: '#003366',
                                    color: '#FFFFFF',
                                },
                                transition: 'background-color 0.3s, color 0.3s'
                            }}
                        >
                            
                            Sign In
                    </Button>
                    </Box>
                    </SignedOut>
                    <SignedIn>
                         {/* Search Bar */}
                    <Box sx={{ flexGrow: 10, display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 2, padding: '0 8px' }}>
                        <SearchIcon sx={{ color: '#000000' }} />
                        <InputBase
                            placeholder="Search items..."
                            sx={{ marginLeft: 1, flex: 1, color: '#000000' }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        <Button variant="contained" href="/home" sx={{ mr: 1, backgroundColor: '#FFFFFF', color: '#000000', '&:hover': { backgroundColor: '#003366', color: '#FFFFFF' } }}>
                            Home
                        </Button>
                        <Button variant="contained" href="/" sx={{ mr: 1, backgroundColor: '#FFFFFF', color: '#000000', '&:hover': { backgroundColor: '#003366', color: '#FFFFFF' } }}>
                            Dashboard
                        </Button>
                        <Button variant="contained" href="/explore" sx={{ backgroundColor: '#FFFFFF', color: '#000000', '&:hover': { backgroundColor: '#003366', color: '#FFFFFF' } }}>
                            Explore
                        </Button>
                       
                    </Box>
                    <UserButton />
                    </SignedIn>
                </Toolbar>
            </AppBar>

            {/* Landing Page Content */}
            <Container maxWidth={false} sx={{
                minHeight: '100vh',
                padding: 0,
                backgroundColor: '#003366',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
            }}>
                <Box
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showText ? 1 : 0 }}
                    transition={{ duration: 1 }}
                >
                    <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                        UMarkIt
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ color: '#FFFFFF' }}>
                        A platform for UMass Lowell students to share services or sell school-related items.
                    </Typography>
                    <Button variant='contained' href="/sign-up" sx={{
                        mt: 4,
                        backgroundColor: '#FFFFFF',
                        color: '#003366',
                        '&:hover': {
                            backgroundColor: '#FFFFFF',
                        }
                    }}>
                        Sign Up
                    </Button>
                </Box>
            </Container>

            {/* Cookie Consent Bar */}
            <Box
                position="fixed"
                bottom={0}
                left={0}
                right={0}
                bgcolor="#333"
                color="white"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
                zIndex={1000}
                sx={{ display: open ? 'flex' : 'none' }}
            >
                <Typography variant="body2">
                    We use cookies to ensure you get the best experience. By continuing, you consent to our cookies.
                </Typography>
                <Box>
                    <Button onClick={handleAccept} variant="contained" sx={{ backgroundColor: '#FFFFFF', color: '#333', mr: 2 }}>
                        Accept
                    </Button>
                    <Button onClick={handleDecline} variant="outlined" sx={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}>
                        Decline
                    </Button>
                </Box>
            </Box>

            {/* Sign In Modal */}
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} // Center the modal
            >
                <Box
                    width={400}
                    bgcolor="white"
                    borderRadius={3}
                    boxShadow={24}
                    p={4}
                >
                    <Typography variant="h6" gutterBottom>
                        Create an Account
                    </Typography>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <Stack direction="row" justifyContent="space-between" mt={3}>
                        <Button onClick={handleSignUp} variant="contained" color="primary">
                            Sign Up
                        </Button>
                        <Button onClick={handleModalClose} variant="outlined">
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
}