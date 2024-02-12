const { db_Select } = require("./MasterModule");
const dateFormat = require("dateformat")

module.exports = {
    totActiveUser: (comp_id) => {
        return new Promise(async (resolve, reject) => {
            var select = 'comp_id, COUNT(id) tot_user', 
            table_name = 'md_user',
            whr = `comp_id = '${comp_id}' AND active_flag = 'Y' AND user_type = 'U'`,
            order = `GROUP BY comp_id`;
            var res_dt = await db_Select(select, table_name, whr, order)
            resolve(res_dt)
        })
    },
    todayTotalColl: (comp_id) => {
        return new Promise(async (resolve, reject) => {
            var currDt = dateFormat(new Date(), "yyyy-mm-dd")
            var select = 'comp_id, entry_date, SUM(net_qty) tot_qty, SUM(net_weight) tot_weight', 
            table_name = 'td_collection',
            whr = `comp_id = '${comp_id}' AND entry_date = '${currDt}'`,
            order = `GROUP BY comp_id, entry_date`;
            var res_dt = await db_Select(select, table_name, whr, order)
            resolve(res_dt)
        })
    }
}