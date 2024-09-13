'use client'
import {useUser} from '@clerk/nextjs'
import {useEffect, useState} from 'react'
import{Container, Box, Grid, CardActionArea, CardContent, Card, Typography, IconButton} from '@mui/material'
import {collection, doc, getDoc, setDoc} from 'firebase/firestore'
import {db} from '@/firebase'
import {useRouter} from 'next/navigation'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Head from 'next/head'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import PagesIcon from '@mui/icons-material/Pages';

export default function Flashcards(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

        useEffect(() =>{
            async function getFlashcards() {
                if(!user) return
                const docRef = doc(collection(db, 'users'), user.id)
                const docSnap = await getDoc(docRef)

                if(docSnap.exists()){
                    const collections = docSnap.data().flashcards || []
                    setFlashcards(collections) 
                } else{
                    await setDoc(docRef, {flashcards: []})
                }
            }
            getFlashcards()
        }, [user])

        if (!isLoaded || !isSignedIn){
            return <></>
        }
        const handleCardClick = (id) => {
            router.push(`/flashcard?id=${id}`)
        }

        return <Container maxWidth={false} sx={{
            minHeight: '100vh',         
            padding: 0,
            background: '#ece9e2',
            display: 'flex',           
            flexDirection: 'column',  
            justifyContent: 'space-between',
            width: '100%', 
      
          }}>
            <Head>
        <title> MemoMate </title>
        <meta name = "description" contents='Create flashcars from your text'/>
      </Head> 
      <AppBar position="fixed" sx={{ 
      width: '100%',
      background: 'linear-gradient(to right, #e43d11, #efb11e)' 
      }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
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
            <Grid container spacing={3} sx={{ mt: 10 }}>
            <Grid item xs={12}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#e43d11' }}>
                    My Flashcards
                </Typography>
            </Grid>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm = {6} md={4} key={index}> 
                    <Card>
                        <CardActionArea onClick={()=>{
                            handleCardClick(flashcard.name)
                        }}
                        >
                            <CardContent>
                                <Typography variant='h6'>{flashcard.name}</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>

}