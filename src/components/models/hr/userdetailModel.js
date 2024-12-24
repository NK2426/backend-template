import APP from "../../config/index.js";
const sequelize = APP.sequelize()
const DataTypes = APP.Datatypes()

const UserDetail = sequelize.define('userdetails', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
    },
    salary: {
        type: DataTypes.STRING,
    },
    dateofbirth: {
        type: DataTypes.STRING,
    },
    dateofjoin: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    }
    },
    {
        timestamps: false
    }

)
export default UserDetail