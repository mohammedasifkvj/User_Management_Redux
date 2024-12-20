import express from 'express';

import { verifyAdmin } from '../utils/verifyToken.js';
import {
  adminSignin,
  fetchUsers,
  createUser
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

export default router;