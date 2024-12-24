'use strict'
import dotenv from 'dotenv';
dotenv.config()
import{ Sequelize, Op,QueryTypes } from 'sequelize';

class APP {
    constructor(){
    }

    static Op = Op;
    static QueryTypes=QueryTypes;
    static Datatypes(){
        return Sequelize;
    }
    static sequelize(){
        return  new Sequelize(
            process.env.DB,
            process.env.DB_USER,
            process.env.PASSWORD,
            {
            host: process.env.HOST,
            dialect: process.env.DB_TYPE,
            operatorsAliases: 0,            
            pool: {
                 max: 5,
                 min: 0,
                 acquire: 100000,
                 idle: 10000
            },
            logQueryParameters: false,
            logging: false
            }
        );
    }
    static secretKey(){
        return process.env.SECRET_KEY
    }
    static categoryHeadSecrateKey(){
        return process.env.CATEGORY_SECRET_KEY
    }
    static hrecrateKey(){
        return process.env.HR_SECRET_KEY
    }
    static purchasersecrateKey(){
        return process.env.PURCHASER_SECRET_KEY
    } 
    static purchaseheadsecrateKey(){
        return process.env.PURCHASERHEAD_SECRET_KEY
    }
    static vendorsecrateKey(){
        return process.env.VENDOR_SECRET_KEY
    }
    static warehousesecrateKey(){
        return process.env.WAREHOUSE_SECRET_KEY
    }
    static financesecrateKey(){
        return process.env.WAREHOUSE_SECRET_KEY
    }
}

export default APP