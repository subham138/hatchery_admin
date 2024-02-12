const { allCollectionList } = require('../module/ReportModule');

const express = require('express'),
    repoRouter = express.Router(),
    dateFormat = require('dateformat');

repoRouter.use((req, res, next) => {
    var user = req.session.user
    if(user){
        next()
    }else{
        res.redirect('/login')
    }
})

repoRouter.all('/', async (req, res) => {
    var method = req.method
    var selected = {
        frm_dt: method == 'POST' ? req.body.frm_dt : dateFormat(new Date, 'yyyy-MM-dd'),
        to_dt: method == 'POST' ? req.body.to_dt : '',
        active_flag: method == 'POST' ? true : false
    }
    var col_list = []
    var comp_id = req.session.user.comp_id

    if(method == 'POST'){
        col_list = await allCollectionList(comp_id, selected.frm_dt, selected.to_dt)
    }

    var view_dt = {
        header: 'Collection Report',
        col_list: method == 'POST' ? (col_list.suc > 0 ? col_list.msg : []): [],
        selected
    }
    
    res.render('report/collection', view_dt)
})

repoRouter.get('/coll_full_repo', async (req, res) => {
    var dc_no = Buffer.from(decodeURIComponent(req.query.id), "base64").toString()
})

module.exports = {repoRouter}