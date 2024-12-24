'use strict'
import APP from "../../config/index.js";
const sequelize = APP.sequelize();
const DataTypes = APP.Datatypes();

const Roles = sequelize.define("roles", {
  id: {
    type: DataTypes.STRING,
    autoIncrement: true,
    primaryKey: true
  },
  uuid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: "Roles already exists" }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Please enter Roles name" }
    },
    unique: { msg: "Roles already exists" }
  },
  status: {
    type: DataTypes.STRING
  },
},
  {
    timestamps: false
  })
export default Roles



