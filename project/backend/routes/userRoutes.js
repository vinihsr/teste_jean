import express from 'express';

const userRoutes = (userController) => {
  const router = express.Router();

  router.get('/user', async (req, res) => {
    console.log('Received request to /user');
    await userController.getAllUsers(req, res);
  });

  router.post('/user', async (req, res) => {
    console.log('Received request to /user');
    await userController.createUser(req, res);
  });

  router.delete('/user/:id', async (req, res) => {
    console.log('Received request to /user/:id');
    await userController.deleteUser(req, res);
  });
  
  return router;
};

export default userRoutes;