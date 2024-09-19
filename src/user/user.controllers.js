const { generateToken } = require('../utils/jwt');
const { createUser, getuserByLoginID } = require('./user.services');
const model = require("../database/model")
const sql = require('mssql');

module.exports = {
    register: (req, res) => {
        const body = req.body;
        createUser(body, (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Internal Server Error"
                })
            }
            if (results === 'already Exits') {
                res.status(409).json({
                    success: 0,
                    message: "User already exists"
                })
            }
            return res.status(200).json({
                success: 1,
                message: "Register successfull"
            })
        })
    },
    login: (req, res) => {
        const body = req.body;
        const request = model.db.request();
        getuserByLoginID(body, async (err, result) => {
            if (err) {
                // console.log("err",err)
                return res.status(500).json({
                    success: 0,
                    message: "Internal Server Error",
                    err: err
                })
            }
            if (result && result.length !== 0) {
                const compare = (body.UserPassword === result.Password ? true : false);

                if (compare) {
                    const token = generateToken({ LoginName: body.LoginName });

                    if (body.device_token) {
                        let query = `UPDATE UserMasterDetail SET FCMToken = @Fcm_token WHERE UserName = @userName And Password = @password;`

                        request
                            .input("Fcm_token", sql.VarChar(200), body.device_token)
                            .input("userName", sql.VarChar(50), body.LoginName)
                            .input("password", sql.VarChar(50), body.UserPassword)
                        await request.query(query)
                    }


                    return res.status(200).json({
                        success: 1,
                        message: "login Successfull",
                        token: token,
                        // user_id:result.UserRole,
                        user_id: result.Userid,
                        name: result.UserName,
                        AdminID: result.AdminId,
                    })
                }
                else {
                    // console.log("hi")
                    return res.status(401).json({
                        success: 0,
                        message: "Invalid user or password"
                    })
                }
            }
            else {
                // console.log("err")
                return res.status(401).json({
                    success: 0,
                    message: "Invalid user or password"
                })
            }
        })

    },

}