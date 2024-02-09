const express = require('express'),
compRouter = express.Router()

const { getCompanyDtls } = require('../module/CompanyModule')
const { generateRandNo } = require('../module/MasterModule')

compRouter.get("/company", async (req, res) => {
    var res_dt = await getCompanyDtls()
    var view_dt = {
        header: 'Company Details',
        data: res_dt.suc > 0 ? res_dt.msg : []
    }
    res.render('company/view', view_dt)
})

compRouter.get("/company_edit", async (req, res) => {
    var id = req.query.id
    var edit_dt = []
    if(id > 0){
        edit_dt = await getCompanyDtls(id)
    }else{
        ucrc = await generateRandNo()
    }
    var view_dt = {
        header: 'Company Details Edit',
        sub_header: 'Company Details',
        sub_header_url: '/company',
        data: id > 0 ? (edit_dt.suc > 0 ? edit_dt.msg : []) : [],
        ucrc: ucrc
    }
    res.render('company/edit', view_dt)
})

module.exports = {compRouter}