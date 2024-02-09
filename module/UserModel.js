const { db_Select } = require("./MasterModule")

module.exports = {
    login: (user_id) => {
        return new Promise(async (resolve, reject) => {
            var select = 'user_type, user_name, phone, user_id, password, active_flag', 
            table_name = 'md_user', 
            whr = `user_id = '${user_id}'`,
            order = null;
            var res_dt = await db_Select(select, table_name, whr, order)
            resolve(res_dt)
        })
    }
}