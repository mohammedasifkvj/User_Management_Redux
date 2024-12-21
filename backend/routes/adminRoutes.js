import express from 'express';

import { verifyAdmin } from '../utils/verifyToken.js';
import {
  adminSignin,
  fetchUsers,
  createUser,
  fetchData,
  editUser
} from '../controllers/adminController.js';

const router = express.Router();
// router.use((req,res,next)=>{
//   console.log("qwer");
// console.log(req.method);
// next();
// })

router.post('/signin',adminSignin)
router.get('/list',verifyAdmin, fetchUsers);
router.post('/create',verifyAdmin, createUser);
router.get('/getUser/:id',verifyAdmin, fetchData);
router.put('/editUser/:id', verifyAdmin, editUser);

export default router;