const { getCompanyDtls } = require("../module/CompanyModule");
const {
  allCollectionList,
  getBirdWeight,
  getLameBirdWeight,
} = require("../module/ReportModule");
const { updateCollection } = require("../module/collectionModule");

const express = require("express"),
  collectionRouter = express.Router(),
  dateFormat = require("dateformat");

collectionRouter.use((req, res, next) => {
  var user = req.session.user;
  if (user) {
    next();
  } else {
    res.redirect("/login");
  }
});

collectionRouter.all("/", async (req, res) => {
  var method = req.method;
  var selected = {
    frm_dt:
      method == "POST" ? req.body.frm_dt : dateFormat(new Date(), "yyyy-MM-dd"),
    to_dt: method == "POST" ? req.body.to_dt : "",
    active_flag: method == "POST" ? true : false,
  };
  var col_list = [];
  var comp_id = req.session.user.comp_id;

  if (method == "POST") {
    col_list = await allCollectionList(
      comp_id,
      selected.frm_dt,
      selected.to_dt
    );
  }

  console.log(col_list);
  

  var view_dt = {
    header: "Collection List",
    col_list: method == "POST" ? (col_list.suc > 0 ? col_list.msg : []) : [],
    selected,
    dateFormat,
  };

  res.render("collection/view", view_dt);
});

collectionRouter.get("/edit", async (req, res) => {
  var comp_id = req.session.user.comp_id;
  var dc_no = Buffer.from(
    decodeURIComponent(req.query.id),
    "base64"
  ).toString();
  var col_list = await allCollectionList(0, 0, 0, dc_no),
    birdWeight = await getBirdWeight(dc_no),
    lameBirdWeight = await getLameBirdWeight(dc_no),
    comp_dtls = await getCompanyDtls(comp_id);

  var view_dt = {
    header: "Edit Collection",
    sub_header: "Collection List",
    sub_header_url: "/collection",
    data: col_list.suc > 0 ? col_list.msg : [],
    birdWeight: birdWeight.suc > 0 ? birdWeight.msg : [],
    lameBirdWeight: lameBirdWeight.suc > 0 ? lameBirdWeight.msg : [],
    comp_dtls: comp_dtls.suc > 0 ? comp_dtls.msg : [],
    dateFormat,
    id: dc_no,
  };

  res.render("collection/edit", view_dt);
});

collectionRouter.post('/save', async(req, res) => {
  var data = req.body
  console.log(data);
  var user_name = req.session.user.user_name
  var res_dt = await updateCollection(data, user_name)
  if (res_dt.suc > 0) {
    req.session.message = {
      type: "success",
      message:
        "Password updated successfully.. Please try to login with your new password.",
    };
    res.redirect(
      "/collection");
  } else {
    req.session.message = {
      type: "danger",
      message: res_dt.msg,
    };
    res.redirect(
      "/collection/edit?id=" +
        encodeURIComponent(Buffer.from(data.dc_no).toString("base64"))
    );
  }
})

module.exports = { collectionRouter };
