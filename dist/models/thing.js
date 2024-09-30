"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteThing = exports.updateRemoveThingPhoto = exports.updateThing = exports.findAllThings = exports.findOneThing = exports.createThing = void 0;
const db_config_1 = __importDefault(require("../db-config"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const createThing = (name, image_url, callback) => {
    const queryString = 'INSERT INTO thing (name, image_url) VALUES (?, ?)';
    db_config_1.default.query(queryString, [name, image_url], (err, result) => {
        if (err) {
            callback(err);
        }
        if (!result) {
            return callback(new Error('Failed to create thing'));
        }
        const { insertId } = result;
        callback(null, insertId);
    });
};
exports.createThing = createThing;
const findOneThing = (thingId, callback) => {
    const queryString = 'SELECT * FROM thing WHERE id = ?';
    db_config_1.default.query(queryString, [thingId], (err, result) => {
        if (err) {
            callback(err);
        }
        console.log(result);
        if (!Array.isArray(result) || result.length === 0) {
            return callback(new Error('Thing not found'));
        }
        const row = result[0];
        const thing = {
            id: row.id,
            name: row.name,
            image_url: row.image_url
        };
        callback(null, thing);
    });
};
exports.findOneThing = findOneThing;
const findAllThings = (callback) => {
    const queryString = 'SELECT * FROM thing';
    db_config_1.default.query(queryString, (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const things = [];
        rows.forEach(row => {
            const thing = {
                id: row.id,
                name: row.name,
                image_url: row.image_url
            };
            things.push(thing);
        });
        callback(null, things);
    });
};
exports.findAllThings = findAllThings;
const updateThing = (thing, callback) => {
    const queryString = 'UPDATE thing SET name = ? WHERE id = ?';
    db_config_1.default.query(queryString, [thing.name, thing.id], (err) => {
        if (err) {
            callback(err);
        }
        callback(null);
    });
};
exports.updateThing = updateThing;
// Inside your thingModel file (thing.ts)
const updateRemoveThingPhoto = (thingId, image_url, callback) => {
    const queryString = 'UPDATE thing SET image_url = "" WHERE id = ?';
    db_config_1.default.query(queryString, [thingId], (err) => {
        if (err) {
            callback(err);
            return;
        }
        // Delete the previous image file if it exists
        //   console.log('start delete'+image_url);
        if (image_url) {
            const filePath = path_1.default.join('src/uploads', image_url);
            // console.log('start delete'+ filePath);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
        callback(null);
    });
};
exports.updateRemoveThingPhoto = updateRemoveThingPhoto;
const deleteThing = (thingId, callback) => {
    const findImageUrlQuery = 'SELECT image_url FROM thing WHERE id = ?';
    db_config_1.default.query(findImageUrlQuery, [thingId], (error, results) => {
        if (error) {
            callback(error);
            return;
        }
        const imageUrl = results[0]?.image_url;
        const deleteQuery = 'DELETE FROM thing WHERE id = ?';
        db_config_1.default.query(deleteQuery, [thingId], (err) => {
            if (err) {
                callback(err);
                return;
            }
            // Delete the image file if it exists
            if (imageUrl) {
                const filePath = path_1.default.join('src/uploads', imageUrl);
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                }
            }
            callback(null);
        });
    });
};
exports.deleteThing = deleteThing;
