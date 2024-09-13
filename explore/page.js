'use client';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Container, Box, Grid, Drawer, Link, List, ListItem, ListItemText, TextField, Toolbar, Button, Typography, Divider, AppBar, IconButton, InputBase } from '@mui/material';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import React, { useState } from 'react';
import Head from 'next/head';
import SearchIcon from '@mui/icons-material/Search';

export default function Explore() {

  const [textBoxes, setTextBoxes] = useState([
    
  ]);

  const [newText, setNewText] = useState("");

  const handleAddTextBox = () => {
    if (newText.trim ()) {
      setTextBoxes([
        ...textBoxes,
        {
          id: textBoxes.length + 1, // Simple ID increment
          text: newText
        }
      ]);
      setNewText(""); // Clear the input field
    }
  };

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <Container maxWidth={false} sx={{
      minHeight: '100vh', // Ensure it covers the entire viewport height
      padding: 0,
      display: 'flex',
      flexDirection: 'column', // Stack children vertically
      backgroundColor: '#003366', // navy blue color
    }}>
      <Head>
        <title>MemoMate</title>
        <meta name="description" content="Create flashcards from your text" />
        <style>
          {`
            html {
              scroll-behavior: smooth;
            }
          `}
        </style>
      </Head>

      {/* AppBar */}
      <AppBar position="fixed" sx={{ 
        width: '100%',
        background: '#ad7339' 
      }}>
         <Toolbar>
                    <IconButton edge="end" color="inherit" aria-label="BlurOnIcon" sx={{ mr: 0.1 }}>
                        <BlurOnIcon sx={{ color: 'white' }} />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>U-Mark It</Typography>
                    
                    <SignedOut>
                        <Button color="inherit" sx={{ color: 'white' }}>
                            <Link href="/explore" passHref>
                                <Typography sx={{ color: 'white', textDecoration: 'none' }}>Explore</Typography>
                            </Link>
                        </Button>
                        <Button color="inherit" sx={{ color: 'white' }}>
                            <Link href="/sign-in" passHref>
                                <Typography sx={{ color: 'white', textDecoration: 'none' }}>Login</Typography>
                            </Link>
                        </Button>
                        <Button color="inherit" sx={{ color: 'white' }}>
                            <Link href="/sign-up" passHref>
                                <Typography sx={{ color: 'white', textDecoration: 'none' }}>Sign-Up</Typography>
                            </Link>
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

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#f9faf8', // Sidebar background color
            mt: '64px', // Adjust for AppBar height
          },
        }}
      >
        <Box sx={{ overflow: 'auto', mt: '8px' }}>
          {/* Search bar */}
          <Box sx={{ padding: 2 }}>
            <TextField variant="outlined" placeholder="Search" fullWidth />
          </Box>
          <Divider />
          {/* Navigation Tabs */}
          <List>
            <ListItem button component="a" href="#services">
              <ListItemText primary="Services" />
            </ListItem>
            <ListItem button component="a" href="#business">
              <ListItemText primary="Business" />
            </ListItem>
            <ListItem button component="a" href="#textbook">
              <ListItemText primary="Textbook" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1, // Allows the main content to expand and fill the remaining space
          bgcolor: '#003366', // navy blue background color for main content
          p: 3, // Padding around the content
          ml: '240px', // Align main content to the right of the sidebar
          mt: '64px', // Align main content below the AppBar
        }}
      >
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: '#ffffff', textAlign: 'center' }}>
          Explore Page
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ color: '#ffffff', textAlign: 'center' }}>
          These are preferred finds based on your previous searches!
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button variant='contained' href="/generate" sx={{
            mt: 2,
            backgroundColor: '#87a1a2',
            color: '#ffffff', // White text color
            '&:hover': {
              backgroundColor: '#a3cdcf'
            }
          }}>
            Start Exploring 
          </Button>
        </Box>

        {/* Features Section */}
        <Box id="features" sx={{ my: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#ffffff' }}>
            Featured
          </Typography>
          <Grid container spacing={4}>
            {textBoxes.map((box) => (
              <Grid item xs={12} md={4} key={box.id}>
                <Box sx={{
                  p: 3,
                  border: '3px solid',
                  borderColor: '#FFFFFF',
                  borderRadius: 2,
                  backgroundColor: '#003366', // Ensure box background is navy blue
                }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>{box.text}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

        {/* Empty Space Below Features */}
        <Box sx={{ my: 6, height: '50px' }} /> {/* Adjust height as needed */}

        {/* Form to Add New Text Box */}
        <Box sx={{ my: 6 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#ffffff' }}>
            Add your post
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Enter your ad!"
            fullWidth
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            sx={{ input: { color: '#ffffff' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ffffff' } } }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTextBox}
            sx={{ mt: 2, color: '#ffffff' }}
          >
            Add Post
          </Button>
        </Box>
        </Box>

        {/* Services Section */}
        <Box id="services" sx={{ my: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#ffffff' }}>
            Services
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
            <Box sx={{
                p: 3,
                border: '3px solid',
                borderColor: '#FFFFFF',
                borderRadius: 2,
                backgroundColor: '#003366', // Ensure box background is navy blue
              }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#ffffff' }}>Post #1</Typography>
                <Typography sx={{ color: '#ffffff' }}>
                  Seems kinda empty here...
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{
                p: 3,
                border: '3px solid',
                borderColor: '#FFFFFF',
                borderRadius: 2,
                backgroundColor: '#003366', // Ensure box background is navy blue
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>Post #2</Typography>
                <Typography sx={{ color: '#ffffff' }}>
                  Seems kinda empty here...
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{
                p: 3,
                border: '3px solid',
                borderColor: '#FFFFFF',
                borderRadius: 2,
                backgroundColor: '#003366', // Ensure box background is navy blue
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>Post #3</Typography>
                <Typography sx={{ color: '#ffffff' }}>
                  Seems kinda empty here...
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Business Section */}
        <Box id="business" sx={{ my: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#ffffff' }}>
            Business
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
            <Box sx={{
                p: 3,
                border: '3px solid',
                borderColor: '#FFFFFF',
                borderRadius: 2,
                backgroundColor: '#003366', // Ensure box background is navy blue
              }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#ffffff' }}>Post #1</Typography>
                <Typography sx={{ color: '#ffffff' }}>
                  Seems kinda empty here...
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{
                p: 3,
                border: '3px solid',
                borderColor: '#FFFFFF',
                borderRadius: 2,
                backgroundColor: '#003366', // Ensure box background is navy blue
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>Post #2</Typography>
                <Typography sx={{ color: '#ffffff' }}>
                  Seems kinda empty here...
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{
                p: 3,
                border: '3px solid',
                borderColor: '#FFFFFF',
                borderRadius: 2,
                backgroundColor: '#003366', // Ensure box background is navy blue
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>Post #3</Typography>
                <Typography sx={{ color: '#ffffff' }}>
                  Seems kinda empty here...
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Textbook Section */}
        <Box id="textbook" sx={{ my: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#ffffff' }}>
            Textbook
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
            <Box sx={{
                p: 3,
                border: '3px solid',
                borderColor: '#FFFFFF',
                borderRadius: 2,
                backgroundColor: '#003366', // Ensure box background is navy blue
              }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#ffffff' }}>Post #1</Typography>
                <Typography sx={{ color: '#ffffff' }}>
                  Seems kinda empty here...
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{
                p: 3,
                border: '3px solid',
                borderColor: '#FFFFFF',
                borderRadius: 2,
                backgroundColor: '#003366', // Ensure box background is navy blue
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>Post #2</Typography>
                <Typography sx={{ color: '#ffffff' }}>
                  Seems kinda empty here...
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{
                p: 3,
                border: '3px solid',
                borderColor: '#FFFFFF',
                borderRadius: 2,
                backgroundColor: '#003366', // Ensure box background is navy blue
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>Post #3</Typography>
                <Typography sx={{ color: '#ffffff' }}>
                  Seems kinda empty here...
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Contacts/ learn More Section */}
        <Box id="textbook" sx={{ my: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#ffffff' }}>
            Contact Us!
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              
            </Grid>
          </Grid>
        </Box>

      </Box>
    </Container>
  );
}
