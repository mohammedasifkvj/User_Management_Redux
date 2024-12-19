import express from 'express';
import {
  test,
  updateUser,
  deleteAccount
} from '../controllers/userController.js';
import { verifyUserToken } from '../utils/verifyToken.js';

const router = express.Router();

router.get('/', test);
router.post('/update/:id', verifyUserToken, updateUser);
router.delete('/delete/:id', verifyUserToken, deleteAccount);

export default router;