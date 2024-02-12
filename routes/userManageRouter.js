const express = require("express"),
  userManageRouter = express.Router();

const { getCompanyDtls } = require("../module/CompanyModule");
const { getCompAdminUserList, saveCompUser } = require("../module/userManageModule");

userManageRouter.use((req, res, next) => {
    var user = req.session.user;
    if (user) {
      next();
    } else {
      res.redirect("/login");
    }
})

userManageRouter.get('/', async (req, res) => {
    var user_type = req.session.user.user_type,
        comp_id = user_type != 'S' ? req.session.user.user_type : 0;
    var res_dt = await getCompAdminUserList(0, comp_id, user_type == 'S' ? 'A' : 'U');
    var view_dt = {
      header: "User Management",
      data: res_dt.suc > 0 ? res_dt.msg : [],
    };
    res.render("userManage/view", view_dt);
})

userManageRouter.get('/edit', async (req, res) => {
    var user_type = req.session.user.user_type,
      comp_id = user_type != "S" ? req.session.user.user_type : 0,
      id = Buffer.from(decodeURIComponent(req.query.id), "base64").toString(),
      edit_dt = [];

    var comp_list = await getCompanyDtls()

    if(id > 0){
        edit_dt = await getCompAdminUserList(id, comp_id, user_type == 'S' ? 'A' : 'U')
    }

    var view_dt = {
      header: "Add User",
      sub_header: "User Management",
      sub_header_url: "/user",
      data: id > 0 ? (edit_dt.suc > 0 ? edit_dt.msg : []) : [],
      comp_list: comp_list.suc > 0 ? comp_list.msg : [],
      id,
      user_type,
    };
    res.render("userManage/edit", view_dt);
})

userManageRouter.post("/save", async (req, res) => {
  var data = req.body,
  user_name = req.session.user.user_name,
  user_type = req.session.user.user_type;
  var res_dt = await saveCompUser(data, user_name, user_type == 'S' ? 'A' : 'U');
  if (res_dt.suc > 0) {
    req.session.message = {
      type: "success",
      message: res_dt.msg,
    };
    res.redirect("/user");
  } else {
    req.session.message = {
      type: "danger",
      message: "Data not saved",
    };
    res.redirect(
      `/user/edit?id=${encodeURIComponent(
        Buffer.from(data.flag).toString("base64")
      )}`
    );
  }
  // res.send(res_dt);
});

module.exports = { userManageRouter };