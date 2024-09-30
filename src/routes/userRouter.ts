import express, {NextFunction, Request, Response} from 'express'
import User from '../types/user'
import * as userModel from '../models/user'
import { error } from 'console'

const userRouter = express.Router()

export default userRouter

userRouter.get('/', async (req: Request, res: Response) => {
    userModel.findAllUsers((error: Error, users: User[]) => {
        if (error) {
            return res.status(500).json({errorMessage: error.message})
        }

        return res.status(200).json({ data: users })
    })
})

userRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUserName: string = req.body.name;
        const newUserEmail: string = req.body.email;
        const newUserPassword: string = req.body.password;
    
        userModel.createUser(newUserName, newUserEmail, newUserPassword, (error: Error, userId: number) => {
          if (error) {
            return next(error);
          }
    
          return res.status(201).json({ userId });
        });
      } catch (error) {
        // Handle any uncaught error here
        return next(error);
      }
})

userRouter.get('/id/:id', async (req: Request, res: Response) => {
    const userId: number = Number(req.params.id)
    userModel.findOneUserById(userId, (error: Error, user: User) => {
        if (error) {
            return res.status(500).json({errorMessage: error.message})
        }

        return res.status(200).json({ data: user })
    })
})

userRouter.post('/login', async (req: Request, res: Response) => {
    const userEmail: string = req.body.email
    const password: string = req.body.password
    userModel.findOneUserByEmail(userEmail, password, (error: Error, user: User, token: string) => {
        if (error) {
            return res.status(500).json({errorMessage: error.message})
        }

        return res.status(200).json({ user, token })
    })
})

userRouter.put('/:id', async (req: Request, res: Response) => {
    const user: User = req.body
    userModel.updateUser(user, (error: Error) => {
        if (error) {
            return res.status(500).json({errorMessage: error.message})
        }

        return res.status(200).send()
    })
})

userRouter.delete('/:id', async (req: Request, res: Response) => {
    const userId: number = Number(req.params.id)
    userModel.deleteUser(userId, (error: Error) => {
        if (error) {
            return res.status(500).json({errorMessage: error.message})
        }

        return res.status(200).send()
    })
})