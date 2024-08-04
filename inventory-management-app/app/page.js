'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { firestore } from '../firebase'
import {
 collection,
 doc,
 getDocs,
 query,
 setDoc,
 deleteDoc,
 getDoc,
} from 'firebase/firestore'


const style = {
 position: 'absolute',
 top: '50%',
 left: '50%',
 transform: 'translate(-50%, -50%)',
 width: 400,
 bgcolor: 'white',
 border: '2px solid #000',
 boxShadow: 24,
 p: 4,
 display: 'flex',
 flexDirection: 'column',
 gap: 3,
}


const categories = ['Perishable', 'Non-Perishable', 'Beverages', 'Snacks', 'Frozen']


export default function Home() {
 const [inventory, setInventory] = useState([])
 const [open, setOpen] = useState(false)
 const [itemName, setItemName] = useState('')
 const [itemCategory, setItemCategory] = useState('')
 const [itemAddedBy, setItemAddedBy] = useState('')
 const [searchTerm, setSearchTerm] = useState('')
 const [filterCategory, setFilterCategory] = useState('')


 const updateInventory = async () => {
   console.log("Updating inventory...")
   const snapshot = query(collection(firestore, 'inventory'))
   const docs = await getDocs(snapshot)
   const inventoryList = []
   docs.forEach((doc) => {
     inventoryList.push({
       name: doc.id,
       ...doc.data()
     })
   })
   console.log("Fetched inventory:", inventoryList)
   setInventory(inventoryList)
 }
  useEffect(() => {
   updateInventory()
 }, [])


 const addItem = async (item, category, addedBy) => {
   console.log("Adding item:", item, category, addedBy)
   const docRef = doc(collection(firestore, 'inventory'), item)
   const docSnap = await getDoc(docRef)
   if (docSnap.exists()) {
     const { quantity } = docSnap.data()
     await setDoc(docRef, { quantity: quantity + 1, category, addedBy })
   } else {
     await setDoc(docRef, { quantity: 1, category, addedBy })
   }
   await updateInventory()
 }
  const removeItem = async (item) => {
   const docRef = doc(collection(firestore, 'inventory'), item)
   const docSnap = await getDoc(docRef)
   if (docSnap.exists()) {
     const { quantity } = docSnap.data()
     if (quantity === 1) {
       await deleteDoc(docRef)
     } else {
       await setDoc(docRef, { quantity: quantity - 1 })
     }
   }
   await updateInventory()
 }


 const handleOpen = () => setOpen(true);
 const handleClose = () => setOpen(false);


 const filteredInventory = inventory.filter(
   ({ name, category }) =>
     name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
     category?.toLowerCase().includes(filterCategory.toLowerCase())
 )


 return (
   <Box
     width="100vw"
     height="100vh"
     display={'flex'}
     flexDirection={'column'}
     alignItems={'center'}
     bgcolor={'#f0f4f8'}
     padding={4}
     gap={2}
   >
     <Stack direction={'row'} spacing={2} width={'80%'} maxWidth={800}>
       <TextField
         label="Search"
         variant="outlined"
         fullWidth
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
       />
       <FormControl fullWidth variant="outlined">
         <InputLabel>Filter by Category</InputLabel>
         <Select
           value={filterCategory}
           onChange={(e) => setFilterCategory(e.target.value)}
           label="Filter by Category"
         >
           <MenuItem value="">
             <em>None</em>
           </MenuItem>
           {categories.map((category) => (
             <MenuItem key={category} value={category}>
               {category}
             </MenuItem>
           ))}
         </Select>
       </FormControl>
     </Stack>


     <Button variant="contained" color="primary" onClick={handleOpen}>
       Add New Item
     </Button>


     <Modal
       open={open}
       onClose={handleClose}
       aria-labelledby="modal-modal-title"
       aria-describedby="modal-modal-description"
     >
       <Box sx={style}>
         <Typography id="modal-modal-title" variant="h6" component="h2">
           Add Item
         </Typography>
         <Stack width="100%" direction={'column'} spacing={2}>
           <TextField
             label="Item"
             variant="outlined"
             fullWidth
             value={itemName}
             onChange={(e) => setItemName(e.target.value)}
           />
           <FormControl fullWidth>
             <InputLabel>Category</InputLabel>
             <Select
               value={itemCategory}
               onChange={(e) => setItemCategory(e.target.value)}
               label="Category"
             >
               {categories.map((category) => (
                 <MenuItem key={category} value={category}>
                   {category}
                 </MenuItem>
               ))}
             </Select>
           </FormControl>
           <TextField
             label="Added By"
             variant="outlined"
             fullWidth
             value={itemAddedBy}
             onChange={(e) => setItemAddedBy(e.target.value)}
           />
           <Button
             variant="contained"
             color="primary"
             onClick={() => {
               addItem(itemName, itemCategory, itemAddedBy)
               setItemName('')
               setItemCategory('')
               setItemAddedBy('')
               handleClose()
             }}
           >
             Add
           </Button>
         </Stack>
       </Box>
     </Modal>


     <Box
       width={'80%'}
       maxWidth={800}
       border={'1px solid #333'}
       borderRadius={3}
       bgcolor={'white'}
       padding={2}
     >
       <Box
         width="100%"
         padding={2}
         bgcolor={'#1976d2'}
         display={'flex'}
         justifyContent={'center'}
         alignItems={'center'}
         borderRadius={3}
       >
         <Typography variant={'h4'} color={'#fff'} textAlign={'center'}>
           Inventory Items
         </Typography>
       </Box>
      
       <Box
         width="100%"
         maxHeight="400px"
         overflow="auto"
         padding={2}
         display="flex"
         flexDirection="column"
         gap={2}
       >
         {filteredInventory.map(({ name, quantity, category, addedBy }) => (
           <Box
             key={name}
             width="100%"
             minHeight="100px"
             display={'flex'}
             justifyContent={'space-between'}
             alignItems={'center'}
             bgcolor={'#f0f0f0'}
             padding={2}
             borderRadius={3}
             boxShadow={1}
           >
             <Box>
               <Typography variant={'h6'} color={'#333'}>
                 Item: {name.charAt(0).toUpperCase() + name.slice(1)}
               </Typography>
               <Typography variant={'body1'} color={'#333'}>
                 Category: {category}
               </Typography>
               <Typography variant={'body1'} color={'#333'}>
                 Quantity: {quantity}
               </Typography>
               <Typography variant={'body1'} color={'#333'}>
                 Added By: {addedBy || 'N/A'}
               </Typography>
             </Box>
             <Button variant="contained" color="secondary" onClick={() => removeItem(name)}>
               Remove
             </Button>
           </Box>
         ))}
       </Box>
     </Box>
   </Box>
 )
}



