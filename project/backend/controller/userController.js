class UserController {
    constructor(pool) {
      this.pool = pool;
    }
  
    async createUser(req, res) {
      console.log('createUser function called');
      const { name, email } = req.body;
      const query = 'INSERT INTO users (name, email) VALUES (@name, @email)';
      const result = await this.pool.request()
        .input('name', name)
        .input('email', email)
        .query(query);
      if (result.rowsAffected) {
        res.json({ message: 'User created successfully' });
      } else {
        res.status(500).json({ message: 'Error creating user' });
      }
    };
  
    async getAllUsers(req, res) {
      console.log('getAllUsers function called');
      const query = 'SELECT * FROM users';
      const result = await this.pool.request().query(query);
      res.json({ users: result.recordset });
    }

    async deleteUser(req, res) {
      console.log('deleteUser function called');
      const { id } = req.params;
      const query = 'DELETE FROM users WHERE id = @id';
      const result = await this.pool.request()
        .input('id', id)
        .query(query);
      if (result.rowsAffected) {
        res.json({ message: 'User deleted successfully' });
      } else {
        res.status(500).json({ message: 'Error deleting user' });
      }
    }
  };
  
  export default UserController;