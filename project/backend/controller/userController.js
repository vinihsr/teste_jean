import User from '../model/userModel.js';

class UserController {
async getAllUsers(req, res) {
  try {
    const users = await User.find().select('_id name email');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error getting users:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

  async createUser(req, res) {
    const { name, email } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
      }
  
      const newUser = new User({ name, email });
      await newUser.save();
      res.status(201).json({ user: newUser });
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params;

    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (deletedUser) {
        res.json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

const userController = new UserController();

export default {
  getAllUsers: userController.getAllUsers,
  createUser: userController.createUser,
  deleteUser: userController.deleteUser,
};