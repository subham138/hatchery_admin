const { getCompanyDtls } = require("../module/CompanyModule");
const { allCollectionList, getBirdWeight, getLameBirdWeight } = require("../module/ReportModule");

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

collectionRouter.all('/', async (req, res) => {
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
      header: "Collection List",
      col_list: method == "POST" ? (col_list.suc > 0 ? col_list.msg : []) : [],
      selected,
      dateFormat,
    };
    console.log(col_list);
    res.render("collection/view", view_dt);
})

collectionRouter.get('/edit', async (req, res) => {
    var comp_id = req.session.user.comp_id
    var dc_no = Buffer.from(decodeURIComponent(req.query.id), "base64").toString()
    var col_list = await allCollectionList(0, 0, 0, dc_no),
    birdWeight = await getBirdWeight(dc_no),
    lameBirdWeight = await getLameBirdWeight(dc_no),
    comp_dtls = await getCompanyDtls(comp_id);
    id = Buffer.from(decodeURIComponent(req.query.id), "base64").toString();
    
    var view_dt = {
      header: "Edit Collection",
      sub_header: "Collection List",
      sub_header_url: "/collection",
      data: col_list.suc > 0 ? col_list.msg : [],
      birdWeight: birdWeight.suc > 0 ? birdWeight.msg : [],
      lameBirdWeight: lameBirdWeight.suc > 0 ? lameBirdWeight.msg : [],
      comp_dtls: comp_dtls.suc > 0 ? comp_dtls.msg : [],
      dateFormat,
      id,
    };
    
    res.render("collection/edit", view_dt)
})

module.exports = { collectionRouter };
