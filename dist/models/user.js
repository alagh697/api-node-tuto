"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.findAllUsers = exports.findOneUserByEmail = exports.findOneUserById = exports.createUser = void 0;
const db_config_1 = __importDefault(require("../db-config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUser = (name, email, password, callback) => {
    const queryString = 'INSERT INTO user (name, email, password, created_at) VALUES (?, ?, ?, ?)';
    db_config_1.default.query(queryString, [name, email, password, new Date()], (err, result) => {
        if (err) {
            callback(err);
        }
        if (!result) {
            return callback(new Error('Failed to create user'));
        }
        const { insertId } = result;
        callback(null, insertId);
    });
};
exports.createUser = createUser;
const findOneUserById = (userId, callback) => {
    const queryString = 'SELECT * FROM User WHERE id = ?';
    db_config_1.default.query(queryString, [userId], (err, result) => {
        if (err) {
            callback(err);
        }
        const row = result[0];
        const user = {
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password,
            created_at: row.created_at
        };
        callback(null, user);
    });
};
exports.findOneUserById = findOneUserById;
const findOneUserByEmail = (userEmail, password, callback) => {
    const queryString = 'SELECT * FROM user WHERE email = ?';
    db_config_1.default.query(queryString, [userEmail], async (err, result) => {
        if (err) {
            return callback(err);
        }
        const row = result[0];
        if (!row) {
            return callback(new Error('User not found'));
        }
        const user = {
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password,
            created_at: row.created_at,
        };
        try {
            const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
            if (passwordMatch) {
                // Passwords match, generate JWT
                const token = jsonwebtoken_1.default.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
                // Return user and token to callback
                callback(null, user, token);
            }
            else {
                callback(new Error('Incorrect password'));
            }
        }
        catch (error) {
            callback(error);
        }
    });
};
exports.findOneUserByEmail = findOneUserByEmail;
const findAllUsers = (callback) => {
    const queryString = 'SELECT * FROM user ';
    db_config_1.default.query(queryString, (err, result) => {
        if (err) {
            callback(err);
        }
        const rows = result;
        const users = [];
        rows.forEach(row => {
            const user = {
                id: row.id,
                name: row.name,
                email: row.email,
                password: row.password,
                created_at: row.created_at
            };
            users.push(user);
        });
        callback(null, users);
    });
};
exports.findAllUsers = findAllUsers;
const updateUser = (user, callback) => {
    const queryString = 'UPDATE user SET name = ? WHERE id = ?';
    db_config_1.default.query(queryString, [user.name, user.id], (err) => {
        if (err) {
            callback(err);
        }
        callback(null);
    });
};
exports.updateUser = updateUser;
const deleteUser = (userId, callback) => {
    const queryString = 'DELETE FROM user WHERE id = ?';
    db_config_1.default.query(queryString, [userId], (err) => {
        if (err) {
            callback(err);
        }
        callback(null);
    });
};
exports.deleteUser = deleteUser;
