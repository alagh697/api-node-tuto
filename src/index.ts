import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import thingRouter from './routes/thingRouter'
import userRouter from './routes/userRouter'
import path from 'path'
import likeRouter from './routes/likeRouter'

const app = express()

app.use(express.json())

app.use(cors())


// Serve uploaded images
const uploadsPath = path.resolve(__dirname, '..', 'src', 'uploads');
console.log('uploadsPath:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));


app.use('/things', thingRouter)
app.use('/users', userRouter)
app.use('/likes', likeRouter)

// Custom error class
class MyCustomError extends Error {
    constructor(public message: string, public statusCode: number) {
      super(message);
    }
  }
  
  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the error to the console
  
    // Set a default status code and error message
    let statusCode = 500;
    let errorMessage = 'An internal server error occurred.';
  
    // Customize error handling based on the error type
    if (err instanceof MyCustomError) {
      statusCode = err.statusCode;
      errorMessage = err.message;
    }
  
    // Send the error response to the client
    res.status(statusCode).json({ errorMessage });
  });
  
  // Start the server
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
})


process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });