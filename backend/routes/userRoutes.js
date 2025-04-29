import express from 'express';
import {
  test,
  updateUser,
  deleteAccount,
  fetchTasks,
  updateTaskStatus
} from '../controllers/userController.js';
import { verifyUserToken } from '../utils/verifyToken.js';

const router = express.Router();

router.get('/', test);
router.post('/update/:id', verifyUserToken, updateUser);
router.delete('/delete/:id', verifyUserToken, deleteAccount);
router.get('/getTasks/:userId',verifyUserToken, fetchTasks);
router.patch('/updateTask/:taskId',verifyUserToken, updateTaskStatus);

export default router;