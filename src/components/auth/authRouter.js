'use strict'
import dotenv from 'dotenv';
dotenv.config()
//const router = require("express").Router()
//const authController = require('../auth/authController')
import express from "express";
const router=express.Router()
import authController from "./authController.js"
const API_URL = `${process.env.API_URL}`
const authRoute=async (app) => {
    console.log(API_URL,"testing=>")
    router.post('/auth', authController.signIn)
    app.use(`${API_URL}`, router)    
}
export default authRoute