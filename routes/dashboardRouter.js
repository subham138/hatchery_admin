const { getCompanyDtls } = require('../module/CompanyModule');
const { totActiveUser, todayTotalColl } = require('../module/DashboardModule')

const express = require('express'),
    dashRouter = express.Router();

dashRouter.get("/dashboard", async (req, res) => {
    var user = req.session.user
    if(user){
        if(user.first_login != 'Y'){
            var comp_id = user.comp_id;
            var actUserDt = await totActiveUser(comp_id),
            todayTotCol = await todayTotalColl(comp_id),
            comp_dtls = await getCompanyDtls(comp_id)
            var view_dt = {
                header: `${comp_dtls.suc > 0 ? (comp_dtls.msg.length > 0 ? `${comp_dtls.msg[0].name} - (UCRC: ${comp_dtls.msg[0].ucrc})` : '') : ''}`,
                active_user: actUserDt.suc > 0 ? (actUserDt.msg.length > 0 ? actUserDt.msg[0].tot_user : 0) : 0,
                today_coll: todayTotCol.suc > 0 ? (todayTotCol.msg.length > 0 ? todayTotCol.msg[0] : {}) : {},
            }
            res.render('dashboard', view_dt)
        }else{
            res.redirect('/first_login')
        }
    }else{
        res.redirect('/login')
    }
})

module.exports = {dashRouter}