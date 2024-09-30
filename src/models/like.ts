import Thing from '../types/thing'
import connection from '../db-config'
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import path from 'path'
import fs from 'fs'
import Like from '../types/like'

export const createLike = (userId: number, thingId: number, callback: Function ) => {
    const queryString = 'INSERT INTO likes (user_id, thing_id) VALUES (?, ?)'

    connection.query(queryString, [userId, thingId], (err, result) => {
        if (err) {
            callback(err)
        }

        if (!result) {
            return callback(new Error('Failed to create Like'));
          }

        const { insertId } = <ResultSetHeader>result
        callback(null, insertId)

    })


}

// export const findOneThing = (thingId: number, callback: Function ) => {
//     const queryString = 'SELECT * FROM thing WHERE id = ?'

//     connection.query(queryString, [thingId], (err, result) => {
//         if (err) {
//             callback(err)
//         }
// console.log(result)

//         if (!Array.isArray(result) || result.length === 0) {
//           return callback(new Error('Thing not found'));
//       }

//         const row = (<RowDataPacket>result)[0]
//         const thing : Thing = {
//             id: row.id,
//             name: row.name,
//             image_url: row.image_url
//         }
//         callback(null, thing)

//     })

// }

export const findAllLikes = ( callback: Function ) => {
    const queryString = 'SELECT * FROM likes '

    connection.query(queryString, (err, result) => {
        if (err) {
            callback(err)
        }

        const rows = <RowDataPacket[]> result
        const likes: Like[] = []

        rows.forEach( row =>{
        const like : Like = {
            id: row.id,
            user: row.user_id,
            thing: row.thing_id,
            created_at: row.created_at
        }
        likes.push(like)
    })
        callback(null, likes)

    })


}

export const findLikesByThing = (likeIdThing: number, callback: Function) => {
    const queryString = `SELECT * FROM likes WHERE thing_id = ? `
  
    connection.query(queryString, [likeIdThing],  (error, result) => {
        if (error) {
            callback(error)
        }
  
        const rows = <RowDataPacket[]>result
        const likes: Like[] = []
  
        rows.forEach((row) => {
            const like: Like = {
                id: row.id,
                user: row.user_id,
                thing: row.thing_id,
                created_at: row.created_at
            }
            likes.push(like)
        })
  
        callback(null, likes)
    })
  }


  export const deleteLike = (likeId: number, callback: Function) => {
    
  
    const deleteQuery = 'DELETE FROM likes WHERE id = ?';
  
    connection.query(deleteQuery, [likeId], (err) => {
      if (err) {
        callback(err);
        return;
      }

      

      callback(null);
    });
  };