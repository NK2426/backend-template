import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import APP from "../config/index.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/hr/userModel.js";
const Op = APP.Op;

const signIn = async (req, res, next) => {
  try {
    // console.log('checking')
    await User.findOne({
      where: { username: req.body.username, roleid: { [Op.ne]: 6 }, status: 1 },
    })
      .then((user) => {
        if (!user) {
          return next(new ErrorHandler("User not found", 404));
        }
        let passwordvalid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordvalid) {
          return next(new ErrorHandler("Password not valid", 404));
        }
        let token = jwt.sign(
          {
            id: user.uid,
            role: user.roleID,
            name: user.name,
            warehouse_id: user.warehouse_id,
          },
          APP.purchasersecrateKey(),
          { expiresIn: 21600 }
        );

        res.status(200).json({
          id: user.uid,
          uuid: user.uuid,
          status: "Success",
          name: user.name,
          accessToken: token,
          role: user.roleID,
          warehouse_id: user.warehouse_id,
        });
      })
      .catch((err) => {
        next(new ErrorHandler(err, 500));
      });
  } catch (err) {
    next(new ErrorHandler(err, 500));
  }
};

export default { signIn };
