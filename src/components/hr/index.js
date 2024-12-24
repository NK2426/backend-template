'use strict'
import dotenv from "dotenv";
import userRouter from "./users/usersRouter.js";



dotenv.config();
const API_URL = `${process.env.API_URL}/hr`;

export default (app) => {
    userRouter(app, API_URL)};