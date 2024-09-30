import User from '../types/user'
import connection from '../db-config'
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const createUser = (name: string, email: string, password: string, callback: Function ) => {
    const queryString = 'INSERT INTO user (name, email, password, created_at) VALUES (?, ?, ?, ?)';

    connection.query(queryString, [name, email, password, new Date()], (err, result) => {
        if (err) {
            callback(err)
        }

        if (!result) {
            return callback(new Error('Failed to create user'));
          }

        const { insertId } = <ResultSetHeader>result
        callback(null, insertId)

    })


}

export const findOneUserById = (userId: number, callback: Function ) => {
    const queryString = 'SELECT * FROM User WHERE id = ?'

    connection.query(queryString, [userId], (err, result) => {
        if (err) {
            callback(err)
        }

        const row = (<RowDataPacket>result)[0]
        const user : User = {
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password,
            created_at: row.created_at
        }
        callback(null, user)

    })

}

export const findOneUserByEmail = (userEmail: string, password: string, callback: Function) => {
    const queryString = 'SELECT * FROM user WHERE email = ?';
  
    connection.query(queryString, [userEmail], async (err, result) => {
      if (err) {
        return callback(err);
      }
  
      const row = (<RowDataPacket>result)[0];
      if (!row) {
        return callback(new Error('User not found'));
      }
  
      const user: User = {
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        created_at: row.created_at,
      };
  
      try {
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (passwordMatch) {
          // Passwords match, generate JWT
          const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
  
          // Return user and token to callback
          callback(null, user, token);
        } else {
          callback(new Error('Incorrect password'));
        }
      } catch (error) {
        callback(error);
      }
    });
  }

export const findAllUsers = ( callback: Function ) => {
    const queryString = 'SELECT * FROM user '

    connection.query(queryString, (err, result) => {
        if (err) {
            callback(err)
        }

        const rows = <RowDataPacket[]> result
        const users: User[] = []

        rows.forEach( row =>{
            const user : User = {
                id: row.id,
                name: row.name,
                email: row.email,
                password: row.password,
                created_at: row.created_at
            }
        users.push(user)
    })
        callback(null, users)

    })


}

export const updateUser = (user: User, callback: Function ) => {
    const queryString = 'UPDATE user SET name = ? WHERE id = ?'

    connection.query(queryString, [user.name, user.id], (err) => {
        if (err) {
            callback(err)
        }

        
        callback(null)

    })

}

export const deleteUser = (userId: number, callback: Function ) => {
    const queryString = 'DELETE FROM user WHERE id = ?'

    connection.query(queryString, [userId], (err) => {
        if (err) {
            callback(err)
        }

        
        callback(null)

    })

}