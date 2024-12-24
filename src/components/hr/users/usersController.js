"use strict";
import APP from "../../config/index.js";
const Op = APP.Op;
const QueryTypes = APP.QueryTypes;
import User from "../../models/hr/userModel.js";
const sequelize = APP.sequelize();

import helper from "../helper.js";
import ErrorHandler from "../../utils/errorHandler.js";
//import { v4 as uuidv4 } from "uuid";
import Roles from "../../models/hr/rolesModal.js";
import UserDetail from "../../models/hr/userdetailModel.js";
import bcrypt from "bcryptjs";

const getAll = async (req, res, next) => {
  try {
    const { page, size, search } = req.query;

    let cond = {
      status: { [Op.ne]: "-1" },
      uid: { [Op.ne]: "1" },
      roleID: { [Op.ne]: "6" },
    };
    if (search)
      cond = {
        [Op.or]: [
          { uuid: { [Op.like]: `%${search}%` } },
          { name: { [Op.like]: `%${search}%` } },
          { mobile: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
        status: { [Op.ne]: "-1" },
        uid: { [Op.ne]: "1" }, 
        roleID:{[Op.ne]:"6"}
      };
    let status = ["0", "1"];
    if (req.params.type) {
      let type = req.params.type;
      cond.status = type;
    }
    const { limit, offset } = helper.getPagination(page, size);
    await User.findAndCountAll({
      include: [Roles], //, { model: Warehouse, attributes:['name'] }
      where: cond,
      limit,
      offset,
    })
      .then((Users) => {
        const response = helper.getPagingData(Users, page, limit);
        res.status(200).json(response);
      })
      .catch((err) => {
        console.log(err);
        return next(new ErrorHandler(err, 500));
      });
  } catch (err) {
    return next(new ErrorHandler(err, 500));
  }
};
const add = async (req, res, next) => {
  try {
    let data = req.body;
    let role = data.role === 0 ? -1 : data.role;
    let userinfo = {
      uuid: data.uuid,
      name: data.firstname,
      username: data.username,
      password: bcrypt.hashSync(data.password, 10),
      email: data.email,
      mobile: data.mobile,
      roleID: data.role,
      warehouse_id: data.warehouse_id || 0,
      status: 1,
      createdBy: req.user.id,
      modifiedBy: 0,
    };
    await User.create(userinfo)
      .then(async (resuser) => {
        const moredetails = {
          user_id: resuser.uid,
          lastname: !data.lastname ? "" : data.lastname,
          salary: !data.salary ? "" : data.salary,
          dateofbirth: !data.dateofbirth ? "" : data.dateofbirth.toString(),
          dateofjoin: !data.dateofjoin ? "" : data.dateofjoin.toString(),
          address: !data.address ? "" : data.address,
        };
        //// Add User Details //////
        await UserDetail.create(moredetails);
       
        res.status(201).json({
          status: 201,
          message: "User created successfully !",
          data: resuser,
        });
      })
      .catch((err) => {
        console.log("err =>", err);
        // return next(new ErrorHandler(helper.getError(err), 400))
        return res
          .status(500)
          .json({ status: 500, message: helper.getError(err), data: "" });
      });
  } catch (err) {
    return next(new ErrorHandler(err, 500));
  }
};

const edit = async (req, res, next) => {
  try {
    let setuser = await User.findOne({
      where: {
        uuid: req.params.uuid,
        roleID: { [Op.ne]: "6" },
        status: { [Op.ne]: "-1" },
      },
    });
    let username = setuser.username;
    if (setuser) {
      let userdetail = await UserDetail.findOne({
        where: { user_id: setuser.uid },
      });
      let data = req.body;
      let role = data.role == 0 ? -1 : data.role;
      let userinfo = {
        name: data.firstname,
        username: data.username,
        email: data.email,
        mobile: data.mobile,
        roleID: data.role,
        warehouse_id: data.warehouse_id || 0,
        status: data.status,
        modifiedBy: req.user.id,
      };
      if (data.password && data.password != "")
        userinfo.password = bcrypt.hashSync(data.password, 10);

      setuser
        .update(userinfo)
        .then((resuser) => {
          const moredetails = {
            user_id: setuser.uid,
            lastname: data.lastname || "",
            salary: data.salary || "",
            dateofbirth: !data.dateofbirth ? "" : data.dateofbirth.toString(),
            dateofjoin: !data.dateofjoin ? "" : data.dateofjoin.toString(),
            address: data.address || "",
          };
          if (userdetail) userdetail.update(moredetails);
          else UserDetail.create(moredetails);

          if (userinfo.password) {
            Mailjob.create({
              email: userinfo.email,
              eid: 1,
              respval:
                userinfo.name + "," + userinfo.username + "," + data.password,
            });
          } else if (username != resuser.username) {
            Mailjob.create({
              email: userinfo.email,
              eid: 1,
              respval: userinfo.name + "," + userinfo.username,
            });
          }

          res.status(200).json({
            status: 200,
            message: "User updated successfully !",
            data: resuser,
          });
        })
        .catch((err) => {
          // console.log(helper.getError(err)," 0000000")
          // return next(new ErrorHandler('Email already exists', 400))
          return res
            .status(500)
            .json({ status: 500, message: helper.getError(err), data: "" });
        });
    } else {
      return next(new ErrorHandler("User does not exists", 400));
    }
  } catch (err) {
    return next(new ErrorHandler(err, 500));
  }
};
const view = async (req, res, next) => {
  try {
    await User.findOne({
      where: {
        uuid: req.params.uuid,
        roleID: { [Op.ne]: "6" },
        status: { [Op.ne]: "-1" },
      },
      include: [UserDetail],
    }).then((resuser) => {
      if (resuser) {
        resuser = resuser.toJSON();
        delete resuser.uid;
        delete resuser.password;
        if (resuser.userdetail) {
          resuser.lastname = resuser.userdetail.lastname || "";
          resuser.salary = resuser.userdetail.salary || "";
          resuser.dateofbirth =
            !resuser.userdetail.dateofbirth ||
            resuser.userdetail.dateofbirth == "0000-00-00"
              ? ""
              : resuser.userdetail.dateofbirth;
          resuser.dateofjoin =
            !resuser.userdetail.dateofjoin ||
            resuser.userdetail.dateofjoin == "0000-00-00"
              ? ""
              : resuser.userdetail.dateofjoin;
          resuser.address = resuser.userdetail.address || "";
        }
        res
          .status(200)
          .json({ status: 200, message: "Success", data: resuser });
      } else {
        return next(new ErrorHandler("User does not exists", 400));
      }
    });
  } catch (err) {
    return next(new ErrorHandler(err, 500));
  }
};
const deletes = async (req, res, next) => {
  try {
    await User.findOne({
      where: {
        uuid: req.params.uuid,
        roleID: { [Op.ne]: "6" },
        status: { [Op.ne]: "-1" },
      },
    }).then((User) => {
      if (User) {
        let updateValue = {
          name: "trash-" + User.name + "-" + User.uid,
          username: "trash-" + User.username + "-" + User.uid,
          modifiedBy: req.user.id,
          status: -1,
        };
        User.update(updateValue)
          .then((User) => {
            res.status(200).json({
              status: 200,
              message: "User deleted successfully !",
              data: User,
            });
          })
          .catch((err) => {
            return next(new ErrorHandler(helper.getError(err), 400));
          });
      } else {
        return next(new ErrorHandler("User does not exists", 400));
      }
    });
  } catch (err) {
    return next(new ErrorHandler(err, 500));
  }
};

const editprofile = async (req, res, next) => {
  try {
    console.log(req);
    await User.findOne({ where: { uuid: req.body.uuid } })
      .then((user) => {
        delete req.body.password;
        delete req.body.username;
        user
          .update(req.body)
          .then(() => {
            res.send({
              status: "success",
              message: "Profile Updated Successfully !",
            });
          })
          .catch((err) => {
            next(new ErrorHandler(err, 500));
          });
      })
      .catch((err) => {
        next(new ErrorHandler(err, 500));
      });
  } catch (err) {
    next(new ErrorHandler(err, 500));
  }
};

const changepwd = async (req, res, next) => {
  try {
    if (req.body.password != req.body.confirmpassword) {
      res.send({
        status: "failure",
        message: "New password and confirm password does not match",
      });
    } else {
      await User.findOne({ where: { uid: req.user.id } })
        .then((user) => {
          let passwordvalid = req.body.oldpassword
            ? bcrypt.compareSync(req.body.oldpassword, user.password)
            : "";
          if (passwordvalid != "") {
            if (req.body.oldpassword != req.body.confirmpassword) {
              const password = bcrypt.hashSync(req.body.password, 10);
              //console.log(user)
              user
                .update({ password: password })
                .then(() => {
                  res.send({
                    status: "success",
                    message: "Password changed Successfully !",
                  });
                })
                .catch((err) => {
                  next(new ErrorHandler(err, 500));
                });
            } else
              res.send({
                status: "failure",
                message:
                  "This password is already use.Please enter the new password to change",
              });
          } else {
            res.send({
              status: "failure",
              message: "Please enter the correct password",
            });
          }
        })
        .catch((err) => {
          //console.log(err)
          next(new ErrorHandler(err, 500));
        });
    }
  } catch (err) {
    next(new ErrorHandler(err, 500));
  }
};

export default {
  getAll,
  add,
  edit,
  editprofile,
  view,
  deletes,
  changepwd
};