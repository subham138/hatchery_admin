const { db_Select, db_Insert } = require("./MasterModule")
const bcrypt = require('bcrypt'),
dateFormat = require("dateformat");

module.exports = {
    login: (user_id) => {
        return new Promise(async (resolve, reject) => {
            var select = 'id, comp_id, user_type, user_name, phone, user_id, password, active_flag, first_login, last_login', 
            table_name = 'md_user', 
            whr = `user_id = '${user_id}'`,
            order = null;
            var res_dt = await db_Select(select, table_name, whr, order)
            resolve(res_dt)
        })
    },
    updateLastLogin: (id) => {
        return new Promise(async (resolve, reject) => {
            var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            var table_name = 'md_user',
            fields = `last_login = '${datetime}', modified_by = 'System', modified_dt = '${datetime}'`,
            values = null,
            whr = `id = ${id}`,
            flag = 1;
            var res_dt = await db_Insert(table_name, fields, values, whr, flag);
            resolve(res_dt)
        })
    },
    resetPassword: (data, id, user_name) => {
        return new Promise(async (resolve, reject) => {
            var return_dt = {}, datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            var select = 'id, password', 
            table_name = 'md_user', 
            whr = `id = '${id}'`,
            order = null;
            var res_dt = await db_Select(select, table_name, whr, order)
            if(await bcrypt.compare(data.old_pass, res_dt.msg[0].password)){
                var pass = bcrypt.hashSync(data.password, 10)
                var table_name = 'md_user',
                fields = `password = '${pass}', first_login = 'N', modified_by = '${user_name}', modified_dt = '${datetime}'`,
                values = null,
                whr = `id = ${id}`,
                flag = 1;
                var res_up = await db_Insert(table_name, fields, values, whr, flag);
                if(res_up.suc > 0){
                    return_dt = {suc: 1, msg: 'Updated'}
                }else{
                    return_dt = {suc: 0, msg: 'Try Again'}
                }
            }else{
                return_dt = {suc: 0, msg: 'Old Password not matched'}
            }
            resolve(return_dt)
        })
    }
}