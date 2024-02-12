const { login } = require('../module/UserModel');

const express = require('express'),
    userRouter = express.Router(),
    bcrypt = require('bcrypt');

userRouter.get('/login', (req, res) => {
    // console.log(bcrypt.hashSync('123', 10));
    res.render('login')
})

userRouter.post('/login', async (req, res) => {
    var data = req.body
    var userDt = await login(data.user_id);
    if (userDt.suc > 0) {
        if (userDt.msg.length > 0) {
            if (await bcrypt.compare(data.password, userDt.msg[0].password)) {
                req.session.user = userDt.msg[0]
                res.redirect('/dashboard')
            } else {
                req.session.message = {
                    type: "warning",
                    message: "Please check your user-id or password",
                };
                res.redirect('/login')
            }
        } else {
            req.session.message = {
                type: "warning", message: "UserId not exist"
            };
            res.redirect('/login')
        }
    } else {
        req.session.message = {
            type: "danger", message: "Error occurs.. Please try again later"
        };
        res.redirect('/login')
    }
})

userRouter.get("/log_out", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = { userRouter }