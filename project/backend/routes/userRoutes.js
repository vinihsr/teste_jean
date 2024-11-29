import express from 'express';
import UserController from '../controller/userController.js';

const router = express.Router();

router.get('/user', UserController.getAllUsers);

router.post('/user', UserController.createUser);

router.delete('/user/:id', UserController.deleteUser);

export default router;