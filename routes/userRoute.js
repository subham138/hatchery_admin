const { login, updateLastLogin, resetPassword } = require('../module/UserModel');

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
                await updateLastLogin(userDt.msg[0].id)
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

userRouter.get('/first_login', async (req, res) => {
    var user = req.session.user
    if(user){
        if(user.first_login != 'N'){
            res.render('login/first_login')
        }else{
            res.redirect('/dashboard')
        }
    }else{
        res.redirect('/login')
    }
})

userRouter.post('/reset_pass', async (req, res) => {
    var data = req.body,
    user_id = req.session.user.id,
    user_name = req.session.user.user_name;
    var res_dt = await resetPassword(data, user_id, user_name)
    if(res_dt.suc > 0){
        delete req.session.user
        req.session.message = {
            type: "success",
            message: 'Password updated successfully.. Please try to login with your new password.',
        };
        res.redirect('/login')
    }else{
        req.session.message = {
            type: "danger",
            message: res_dt.msg,
        };
        res.redirect('/first_login')
    }
})

module.exports = { userRouter }