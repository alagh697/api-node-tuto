import express, {NextFunction, Request, Response} from "express"
import Like from "../types/like"
import * as likeModel from '../models/like'


const likeRouter = express.Router()

likeRouter.get('/', async (req:Request, res: Response) => {
    likeModel.findAllLikes((error: Error, Like: Like[]) => {
        if (error) {
            res.status(500).json({ errorMessage: error.message})
        }

        return res.status(200).json(Like)
    })
})

likeRouter.post('/', async (req:Request, res: Response, next: NextFunction) => {
    try{
    const newLikeUserId: number = Number(req.body.user_id);
    const newLikeThingId: number = Number(req.body.thing_id);
    
    likeModel.createLike(newLikeUserId, newLikeThingId, (error: Error, likeId: number) => {
        if (error) {
            return next(error);
        }

        return res.status(201).json({ likeId})
    });
} catch (error) {
        // Handle any uncaught error here
        return next(error);
      }
})




likeRouter.delete('/:id', async (req:Request, res: Response) => {
    const likeId: number = Number(req.params.id)
    likeModel.deleteLike(likeId, (error: Error) => {
        if (error) {
            return res.status(500).json({ message: error.message})
        }

        return res.status(200).send()
    })
})





likeRouter.get('/likesByThing/:id', async (req:Request, res: Response) => {
    const thingId: number = Number(req.params.id)
    likeModel.findLikesByThing(thingId, (error: Error, likes: Like[]) => {
        if (error) {
            return res.status(500).json({ message: error.message})
        }

        return res.status(200).json(likes)
    })
})


export default likeRouter
