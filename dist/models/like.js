"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLike = exports.findLikesByThing = exports.findAllLikes = exports.createLike = void 0;
const db_config_1 = __importDefault(require("../db-config"));
const createLike = (userId, thingId, callback) => {
    const queryString = 'INSERT INTO likes (user_id, thing_id) VALUES (?, ?)';
    db_config_1.default.query(queryString, [userId, thingId], (err, result) => {
        if (err) {
            callback(err);
        }
        if (!result) {
            return callback(new Error('Failed to create Like'));
        }
        const { insertId } = result;
        callback(null, insertId);
    });
};
exports.createLike = createLike;
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
const findAllLikes = (callback) => {
    const queryString = 'SELECT * FROM likes ';
    db_config_1.default.query(queryString, (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const likes = [];
        rows.forEach(row => {
            const like = {
                id: row.id,
                user: row.user_id,
                thing: row.thing_id,
                created_at: row.created_at
            };
            likes.push(like);
        });
        callback(null, likes);
    });
};
exports.findAllLikes = findAllLikes;
const findLikesByThing = (likeIdThing, callback) => {
    const queryString = `SELECT * FROM likes WHERE thing_id = ? `;
    db_config_1.default.query(queryString, [likeIdThing], (error, result) => {
        if (error) {
            callback(error);
        }
        const rows = result;
        const likes = [];
        rows.forEach((row) => {
            const like = {
                id: row.id,
                user: row.user_id,
                thing: row.thing_id,
                created_at: row.created_at
            };
            likes.push(like);
        });
        callback(null, likes);
    });
};
exports.findLikesByThing = findLikesByThing;
const deleteLike = (likeId, callback) => {
    const deleteQuery = 'DELETE FROM likes WHERE id = ?';
    db_config_1.default.query(deleteQuery, [likeId], (err) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null);
    });
};
exports.deleteLike = deleteLike;
