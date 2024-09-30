import Thing from '../types/thing'
import connection from '../db-config'
import { ResultSetHeader, RowDataPacket } from 'mysql2'
import path from 'path'
import fs from 'fs'

export const createThing = (name: string, image_url: string, callback: Function ) => {
    const queryString = 'INSERT INTO thing (name, image_url) VALUES (?, ?)'

    connection.query(queryString, [name, image_url], (err, result) => {
        if (err) {
            callback(err)
        }

        if (!result) {
            return callback(new Error('Failed to create thing'));
          }

        const { insertId } = <ResultSetHeader>result
        callback(null, insertId)

    })


}

export const findOneThing = (thingId: number, callback: Function ) => {
    const queryString = 'SELECT * FROM thing WHERE id = ?'

    connection.query(queryString, [thingId], (err, result) => {
        if (err) {
            callback(err)
        }
console.log(result)

        if (!Array.isArray(result) || result.length === 0) {
          return callback(new Error('Thing not found'));
      }

        const row = (<RowDataPacket>result)[0]
        const thing : Thing = {
            id: row.id,
            name: row.name,
            image_url: row.image_url
        }
        callback(null, thing)

    })

}

export const findAllThings = ( callback: Function ) => {
    const queryString = 'SELECT * FROM thing'

    connection.query(queryString, (err, result) => {
        if (err) {
            callback(err)
        }

        const rows = <RowDataPacket[]> result
        const things: Thing[] = []

        rows.forEach( row =>{
        const thing : Thing = {
            id: row.id,
            name: row.name,
            image_url: row.image_url
        }
        things.push(thing)
    })
        callback(null, things)

    })


}



export const updateThing = (thing: Thing, callback: Function ) => {
    const queryString = 'UPDATE thing SET name = ? WHERE id = ?'

    connection.query(queryString, [thing.name, thing.id], (err) => {
        if (err) {
            callback(err)
        }

        
        callback(null)

    })

}

// Inside your thingModel file (thing.ts)
export const updateRemoveThingPhoto = (thingId: number, image_url: string, callback: Function) => {
    const queryString = 'UPDATE thing SET image_url = "" WHERE id = ?';
  
    connection.query(queryString, [thingId], (err) => {
      if (err) {
        callback(err);
        return;
      }
  
      // Delete the previous image file if it exists
    //   console.log('start delete'+image_url);
      if (image_url) {
        const filePath = path.join('src/uploads', image_url);
        // console.log('start delete'+ filePath);
        if (fs.existsSync(filePath)) {

          fs.unlinkSync(filePath);
        }
      }
  
      callback(null);
    });
  };

  export const deleteThing = (thingId: number, callback: Function) => {
    const findImageUrlQuery = 'SELECT image_url FROM thing WHERE id = ?';
  
    connection.query(findImageUrlQuery, [thingId], (error, results:any) => {
      if (error) {
        callback(error);
        return;
      }
  
      const imageUrl = results[0]?.image_url;
      const deleteQuery = 'DELETE FROM thing WHERE id = ?';
  
      connection.query(deleteQuery, [thingId], (err) => {
        if (err) {
          callback(err);
          return;
        }
  
        // Delete the image file if it exists
        if (imageUrl) {
          const filePath = path.join('src/uploads', imageUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
  
        callback(null);
      });
    });
  };