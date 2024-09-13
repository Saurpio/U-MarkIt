'use client'

import{useUser} from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import {db} from '@/firebase'
import{Container, Box, Typography, TextField, Paper, Button, Grid, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContentText, DialogContent, DialogTitle, IconButton} from '@mui/material'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Head from 'next/head'
import PagesIcon from '@mui/icons-material/Pages';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'

export default function Flashcard() {

    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])

    const searchParams = useSearchParams()
    const search= searchParams.get('id')

    useEffect(() =>{
        async function getFlashcard() {
            if(!search || !user) return
            const colRef = collection (doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = [] 

            docs.forEach((doc)=>{
                flashcards.push({id: doc.id, ...doc.data()})
            })
            setFlashcards(flashcards)
        }
        getFlashcard()

    }, [user, search])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const router = useRouter();

    if (!isLoaded || !isSignedIn){
        return <></>
    }

    return (
        <Container maxWidth={false} sx={{
            minHeight: '100vh',         
            padding: 0,
            background: '#ece9e2',
            display: 'flex',           
            flexDirection: 'column',  
            justifyContent: 'space-between',
            width: '100%', 
            mt: '64px'
          }}>
            <Head>
        <title> MemoMate </title>
        <meta name = "description" contents='Create flashcars from your text'/>
      </Head> 
      <AppBar position="fixed" sx={{ 
      width: '100%',
      background: 'linear-gradient(to right, #e43d11, #efb11e)' 
      }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="pages">
            <PagesIcon sx={{ color: 'white' }}/>
          </IconButton>
          <Typography variant = "h6" style={{flexGrow: 1, fontWeight: 'bold'}}> MemoMate </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in"> Login</Button>
            <Button color="inherit" href="sign-up"> Sign Up</Button>
          </SignedOut>
          <SignedIn>
          <Button color="inherit" onClick={() => router.push('http://localhost:3000')}>
                Home
          </Button>
          <Button color="inherit" href="/generate"> Generate Cards</Button>

            <Button color="inherit" href="/flashcards"> My Cards</Button>
            {' '}
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
            <Grid container spacing = {3} sx={{ mt: 4}}>
            
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs = {12} sm = {6} md = {4} key = {index}>
                            <Card>
                                <CardActionArea onClick={()=> {
                                    handleCardClick(index)
                                }}>
                                    <CardContent>
                                        <Box sx={{
                                            perspective: '1000px',
                                            '& > div' : {
                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                position: 'relative',
                                                width: '100%',
                                                height: '200px',
                                                boxShadow: '2px 4px 6px rgba(0,0,0,0.2)',
                                                transform: flipped[index]
                                                ? 'rotateY(180deg)' 
                                                : 'rotateY(0deg)',
                                            },
                                            '& > div > div' : {
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                backfaceVisibility: "hidden",
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                padding: 2,
                                                boxSizing: 'border-box',
                                            },
                                            '& > div > div:nth-of-type(2)': {
                                                transform: 'rotateY(180deg)',
                                            },
                                        }}>
                                            <div>
                                                <div> 
                                                    <Typography variant="h5" component="div">
                                                        {flashcard.front}
                                                    </Typography> 
                                                </div>
                                                <div> 
                                                    <Typography variant="h5" component="div">
                                                        {flashcard.back}
                                                    </Typography> 
                                                </div>
                                            </div> 
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Container>
    )


}