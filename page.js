'use client'

import getStripe from '../utils/get-stripe';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Container, Box, Modal, Grid, Drawer, List, ListItem, ListItemText, TextField, Toolbar, Button, Typography, Divider, AppBar, IconButton, InputBase } from '@mui/material';
import { useState } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { doc, collection, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import path according to your project structure

// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export default function Home() {
    const [open, setOpen] = useState(false)
    const [userInput, setUserInput] = useState({
        username: '',
        name: '',
        school: '',
        bio: '',
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // add user to collection (no input control)
    const AddUser = async (username, name, school, bio) => {
        // create username -> profile -> info doc
        const userDocRef = doc(collection(db, 'users'), username)
        const profileDocRef = doc(collection(userDocRef, 'profile'), 'info')
        await setDoc(profileDocRef, {
            name: name,
            school: school,
            bio: bio,
        })

        // create -> posts -> saved doc (w/ welcome message)
        const savedpostsDocRef = doc(collection(userDocRef, 'savedposts'), 'first marked post')
        await setDoc(savedpostsDocRef, {
            author: 'fix me',
            message: 'Welcome to UMarkit, this is an example of a saved post',
        })
    }

    // Handler to update state when input fields change
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserInput({
            ...userInput,
            [name]: value
        });
    }

    const handleSubmit = async () => {
        const checkoutSession = await fetch('/api/checkout_session', {
            method: 'POST',
            headers: {
                origin: 'http://localhost:3000',
            },
        })

        const checkoutSessionJson = await checkoutSession.json()

        if (checkoutSession.statusCode === 500) {
            console.error(checkoutSession.message)
            return
        }

        const stripe = await getStripe()
        const { error } = await stripe.redirectToCheckout({
            sessionId: checkoutSessionJson.id
        })

        if (error) {
            console.warn(error.message)
        }
    }

    return (
        <Box sx={{ display: 'flex', width: '100vw', backgroundColor: '#003366'}}>
            <Head>
                <title>U-Markit</title>
                <meta name="description" content='Create flashcards from your text' />
            </Head>

            <AppBar position="fixed" sx={{
                width: '100%', // Adjust for Drawer width
                ml: '240px', // Shift content to the right by Drawer width
                background: '#ad7339',
                zIndex: 1201, // Ensure AppBar is above the Drawer
            }}>
                <Toolbar>
                    <IconButton edge="end" color="inherit" aria-label="BlurOnIcon" sx={{ mr: 0.1 }}>
                        <BlurOnIcon sx={{ color: 'white' }} />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>U-Mark It</Typography>
                    <SignedOut>
                        <Button variant="contained" href="/home" sx={{ mr: 1, backgroundColor: '#FFFFFF', color: '#000000', '&:hover': { backgroundColor: '#003366', color: '#FFFFFF' } }}>
                            Home
                        </Button>
                        <Button variant="contained" href="/sign-in" sx={{ mr: 1, backgroundColor: '#FFFFFF', color: '#000000', '&:hover': { backgroundColor: '#003366', color: '#FFFFFF' } }}>
                            Sign In
                        </Button>
                        <Button variant="contained" href="/sign-up" sx={{ mr: 1, backgroundColor: '#FFFFFF', color: '#000000', '&:hover': { backgroundColor: '#003366', color: '#FFFFFF' } }}>
                            Sign Up
                        </Button>
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
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                        {' '}
                        <UserButton />
                    </SignedIn>
                </Toolbar>
            </AppBar>

            <Box sx={{
                flexGrow: 1,
                mt: '64px', // Ensure spacing for AppBar
                ml: '120px', // Ensure spacing for Drawer
                p: 3, // Padding for main content
                backgroundColor: '#003366'
            }}>
                <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: '#ffffff' }}>
                    U-Dashboard
                </Typography>
                <Typography variant="h5" gutterBottom sx={{ color: '#ffffff' }}>
                    Welcome to your profile!
                </Typography>

                <Box sx={{ my: 6, textAlign: 'center' }}>
                    <Grid container spacing={0.5} >
                    <Grid item xs={12} md={10} lg={12}>
                            <Box sx={{
                                height: '100%',
                                backgroundColor: '#ffffff',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                borderRadius: 2,
                                border: '2px solid #e43d11',
                                padding: '16px', // Add some padding to give the content space
                                mx: 'auto', // Center horizontally
                            }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    User Profile
                                </Typography>
                                <Grid
                                    container
                                    direction="column"
                                    spacing={14} // Added spacing between items
                                    sx={{
                                        width: '100%', // Ensure the inner grid takes full width
                                        alignItems: 'flex-start', // Align items to the start
                                    }}
                                >
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">
                                            Name
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">
                                            Username
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">
                                            School
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">
                                            Bio
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Modal open={open} onClose={handleClose}>
                                    <Box
                                        position="absolute"
                                        top="50%"
                                        left="50%"
                                        width={400}
                                        bgcolor="white"
                                        border="3px solid #333"
                                        boxShadow={24}
                                        p={4}
                                        display="flex"
                                        flexDirection="column"
                                        gap={3}
                                        sx={{
                                            transform: "translate(-50%, -50%)"
                                        }}
                                    >
                                        <Typography variant="h4" gutterBottom>
                                            Add User
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Username"
                                                    name="username"
                                                    value={userInput.username}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Name"
                                                    name="name"
                                                    value={userInput.name}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="School"
                                                    name="school"
                                                    value={userInput.school}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Bio"
                                                    name="bio"
                                                    value={userInput.bio}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                    variant="outlined"
                                                    multiline
                                                    rows={4}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => {
                                                        AddUser(
                                                            userInput.username,
                                                            userInput.name,
                                                            userInput.school,
                                                            userInput.bio
                                                        );
                                                    }}
                                                    fullWidth
                                                >
                                                    Save
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={handleClose}
                                                    fullWidth
                                                >
                                                    Cancel
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Modal>
                                <Button onClick={() => {
                                    handleOpen()
                                }}>
                                    EDIT
                                </Button>
                                <Button onClick={() => {
                                    handleOpen()
                                }}>
                                    Change Field
                                </Button>
                            </Box>
                        </Grid>
                    </Grid >
                </Box>
            </Box>
        </Box>
    )
  }