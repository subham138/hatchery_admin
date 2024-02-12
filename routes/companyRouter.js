const express = require("express"),
  compRouter = express.Router(),
  dateFormat = require("dateformat");

const { getCompanyDtls, saveCompanyData } = require("../module/CompanyModule");
const { generateRandNo } = require("../module/MasterModule");

compRouter.get("/", async (req, res) => {
  var res_dt = await getCompanyDtls();
  var view_dt = {
    header: "Company Details",
    data: res_dt.suc > 0 ? res_dt.msg : [],
    dateFormat: dateFormat,
  };
  res.render("company/view", view_dt);
});

compRouter.get("/edit", async (req, res) => {
  var id = Buffer.from(decodeURIComponent(req.query.id), "base64").toString(),
  ucrc;
  console.log(id);
  var edit_dt = [];
  if (id > 0) {
    edit_dt = await getCompanyDtls(id);
  } else {
    ucrc = await generateRandNo();
  }
  var view_dt = {
    header: "Company Details Edit",
    sub_header: "Company Details",
    sub_header_url: "/company",
    data: id > 0 ? (edit_dt.suc > 0 ? edit_dt.msg : []) : [],
    ucrc: ucrc,
    id,
    dateFormat: dateFormat,
  };
  res.render("company/edit", view_dt);
});

compRouter.post("/save", async (req, res) => {
  var data = req.body;
  var res_dt = await saveCompanyData(data, "admin");
  if (res_dt.suc > 0) {
    req.session.message = {
      type: "success",
      message: res_dt.msg,
    };
    res.redirect("/company");
  } else {
    req.session.message = {
      type: "danger",
      message: "Data not saved",
    };
    res.redirect(
      `/company/edit?id=${encodeURIComponent(
        Buffer.from(data.flag).toString("base64")
      )}`
    );
  }
  // res.send(res_dt);
});

compRouter.get('/dtls_ajax', async (req, res) => {
  var data = req.query
  var res_dt = await getCompanyDtls(data.id)
  res.send(res_dt)
})

module.exports = { compRouter };
