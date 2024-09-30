"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userModel = __importStar(require("../models/user"));
const userRouter = express_1.default.Router();
exports.default = userRouter;
userRouter.get('/', async (req, res) => {
    userModel.findAllUsers((error, users) => {
        if (error) {
            return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(200).json({ data: users });
    });
});
userRouter.post('/register', async (req, res, next) => {
    try {
        const newUserName = req.body.name;
        const newUserEmail = req.body.email;
        const newUserPassword = req.body.password;
        userModel.createUser(newUserName, newUserEmail, newUserPassword, (error, userId) => {
            if (error) {
                return next(error);
            }
            return res.status(201).json({ userId });
        });
    }
    catch (error) {
        // Handle any uncaught error here
        return next(error);
    }
});
userRouter.get('/id/:id', async (req, res) => {
    const userId = Number(req.params.id);
    userModel.findOneUserById(userId, (error, user) => {
        if (error) {
            return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(200).json({ data: user });
    });
});
userRouter.post('/login', async (req, res) => {
    const userEmail = req.body.email;
    const password = req.body.password;
    userModel.findOneUserByEmail(userEmail, password, (error, user, token) => {
        if (error) {
            return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(200).json({ user, token });
    });
});
userRouter.put('/:id', async (req, res) => {
    const user = req.body;
    userModel.updateUser(user, (error) => {
        if (error) {
            return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(200).send();
    });
});
userRouter.delete('/:id', async (req, res) => {
    const userId = Number(req.params.id);
    userModel.deleteUser(userId, (error) => {
        if (error) {
            return res.status(500).json({ errorMessage: error.message });
        }
        return res.status(200).send();
    });
});
