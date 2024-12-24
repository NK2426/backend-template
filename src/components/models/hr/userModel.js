'use strict'
import APP from "../../config/index.js";
const sequelize = APP.sequelize();
const DataTypes = APP.Datatypes();
import Roles from './rolesModal.js'
import UserDetail from './userdetailModel.js';

const User = sequelize.define("users", {
          uid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          uuid: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: "Employee ID already exists" }
          },
          username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: "Username already exists" }
          },
          name: {
            type: DataTypes.STRING
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: { msg: "Please enter an email" },
              isEmail: { msg: "Please enter an email id" }
            },
            unique: { msg: "Email already exists" }
          },
          mobile: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: { msg: "Please enter a mobile number" }
            },
            unique: { msg: "Mobile number already exists" }
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: { msg: "Please enter valid password" }
            }
          },
          roleID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'roles',
              key: 'roleID'
            },
            validate: {
              notEmpty: { msg: "User Role Missing" }
            }
          },
          warehouse_id: {
            type: DataTypes.INTEGER,
          },
          createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          modifiedBy: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          status: {
            type: DataTypes.INTEGER,
          },
        },
        {
          timestamps: true
        })
  User.belongsTo(Roles, { foreignKey: { 'name': 'roleID' } })
  User.hasOne(UserDetail, { foreignKey: { 'name': 'user_id' } })
export default User
