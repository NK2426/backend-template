'use strict'
import dotenv from 'dotenv';
dotenv.config()
import{ Sequelize, Op } from 'sequelize';

class MAPP {
    constructor() {
    }

    static Op = Op;
    static Datatypes() {
        return Sequelize;
    }
    static sequelize() {
        return new Sequelize(
            process.env.MDB,
            process.env.MDB_USER,
            process.env.MPASSWORD,
            {
                host: process.env.MHOST,
                dialect: process.env.DB_TYPE,
                operatorsAliases: 0,
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                },
                //timezone: "+05:30",
                logQueryParameters: false,
                logging: false
            }
        );
    }
    static secretKey() {
        return process.env.SECRET_KEY
    }
}
export default MAPP;