const { db_Select, db_Insert } = require("./MasterModule");
const dateFormat = require("dateformat"),
bcrypt = require('bcrypt');

module.exports = {
    getCompAdminUserList: (id = 0, comp_id = 0, user_type = null, action = 'E') => { // ACTION E-> EDIT AND M-> MANAGE //
        return new Promise(async (resolve, reject) => {
          var select = "a.id, a.comp_id, a.user_type, a.user_name, a.phone, a.active_flag, b.name comp_name, b.ucrc",
            table_name = "md_user a, md_company b",
            whr = `a.comp_id = b.id ${id > 0 ? `AND a.id = '${id}'` : ''} ${comp_id > 0 ? `AND a.comp_id = '${comp_id}'` : ''} ${user_type ? `AND a.user_type = '${user_type}'` : ''}`,
            order = null;
          var res_dt = await db_Select(select, table_name, whr, order);
          if(action != 'E' && id > 0){
            var select =
                "a.id, a.comp_id, a.user_type, a.user_name, a.phone, a.active_flag",
              table_name = "md_user a",
              whr = `a.comp_id = '${res_dt.msg[0].comp_id}' AND a.user_type = 'U'`,
              order = null;
            var user_dt = await db_Select(select, table_name, whr, order);
            res_dt.msg[0]['user_list'] = user_dt.suc > 0 ? user_dt.msg : []
          }
          resolve(res_dt);
        });
    },
    saveCompUser: (data, user_name) => {
        return new Promise(async (resolve, reject) => {
            var pass = bcrypt.hashSync(data.password, 10),
              datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            var table_name = 'md_user',
            fields = data.id > 0 ? `user_name = '${data.user_name}', phone = '${data.phone_no}', 
            user_id = '${data.phone_no}', active_flag = '${data.active_flag ? data.active_flag : "Y"}', modified_by = '${user_name}', modified_dt = '${datetime}'` : 
            `(comp_id, user_type, user_name, phone, user_id, password, created_by, created_dt)`,
            values = `('${data.comp_id}', '${data.user_type}', '${data.user_name}', '${data.phone_no}', 
            '${data.phone_no}', '${pass}', '${user_name}', '${datetime}')`,
            whr = data.id > 0 ? `id = ${data.id}` : null,
            flag = data.id > 0 ? 1 : 0;
            var res_dt = await db_Insert(table_name, fields, values, whr, flag);
            resolve(res_dt)
        })
    }
}