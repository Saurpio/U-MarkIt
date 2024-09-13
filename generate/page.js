'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import{Container, Box, Typography, TextField, Paper, Button, Grid, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContentText, DialogContent, DialogTitle, IconButton} from '@mui/material'
import {writeBatch} from 'firebase/firestore'
import {useState} from 'react'
import {db} from '@/firebase'
import {doc, collection, setDoc, getDoc} from 'firebase/firestore'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Head from 'next/head'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import PagesIcon from '@mui/icons-material/Pages';


export default function Generate(){
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()
    
    const handleSubmit=async () =>{
        fetch('api/generate',{
            method: 'POST',
            body: text,
        })
            .then((res) => res.json())
            .then((data) => setFlashcards(data))
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleOpen =() => {
        setOpen(true)
    }
    const handleClose =() => {
        setOpen(false)
    }

    const saveFlashcards = async () =>{
        if(!name){
            alert('Please enter a name')
            return
        }
        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if(docSnap.exists()){
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert('Flashcard collection with the same name already exists')
                return
            } else{
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }

        }
        else {
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
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
        <Box sx={{
            mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
        <Head>
        <title> MemoMate</title>
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
          <Typography variant = "h6" style={{flexGrow: 1, fontWeight: 'bold'}}> MemoMate</Typography>
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

            <Typography variant="h3" gutterBottom sx={{
            mt: 8, 
            mb: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontWeight: 700, 
            color: '#e43d11',
            }}> Generate Flashcards</Typography>
            <Paper sx={{p: 4, width: '100%'}}>
                <TextField 
                value = {text}
                onChange={(e) => setText(e.target.value)}
                label="Enter text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                InputLabelProps={{
                    sx: {
                      color: '#eda8b7', 
                      '&.Mui-focused': {
                        color: '#d5536d', 
                    },
                    },
                  }}
                sx={{
                    mb: 2,'& .MuiOutlinedInput-root': {
                    '& fieldset': {
                    borderColor: '#d5536d', 
                    },
                    '&:hover fieldset': {
                    borderColor: '#fa7893', 
                    },
                    '&.Mui-focused fieldset': {
                    borderColor: '#fa7893',
                    },
                    },
                    '& .MuiInputLabel-root': {
                    color: '##eda8b7',
                    },
                    }}/>
                <Button variant='contained'sx={{mt: 2, 
                backgroundColor: '#d5536d', 
                '&:hover': {
                backgroundColor: '#fa7893'  
                }}} onClick={handleSubmit} fullWidth> 
                    {' '}
                    Submit 
                </Button>
            </Paper>
        </Box>

        {flashcards.length > 0 && (
            <Box sx={{mt: 4}}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#e43d11' }}> Flashcards Preview</Typography>
                <Grid container spacing = {3}> 
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
                <Box sx= {{mt: 2, display: 'flex', justifyContent: 'center'}}>
                    <Button variant='contained'sx={{mb: 4, 
                backgroundColor: '#d5536d', 
                '&:hover': {
                backgroundColor: '#fa7893'  
                }}} onClick={handleOpen}>
                        Save
                    </Button>
                </Box>
            </Box> 
        )}

        <Dialog open={open} onClose={handleClose}>
            <DialogTitle> Save Flashcards </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter a name for your flashcards collect
                </DialogContentText>
                <TextField 
                autoFocus 
                margin='dense' 
                label="Collection Name" 
                type="text" 
                fullWidth 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                variant="outlined" 
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}> Cancel </Button>
                <Button onClick={saveFlashcards}> Save </Button>
            </DialogActions>
        </Dialog>
    </Container>
}