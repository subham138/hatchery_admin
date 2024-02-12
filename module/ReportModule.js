const { db_Select } = require("./MasterModule");
const dateFormat = require("dateformat")

module.exports = {
    allCollectionList: (comp_id, frm_dt, to_dt, dc_no = 0) => {
        return new Promise(async (resolve, reject) => {
            var select = 'dc_no, trader_id, farmer_id, site_id, super_id, schedule_no, entry_date, scale_no, vehicle_no, driver_id, slip_no, lot_no, str_dt, end_dt, net_qty, net_weight, avg_weight, remarks', 
            table_name = 'td_collection',
            whr = `comp_id = '${comp_id}' AND entry_date BETWEEN '${frm_dt}' AND '${to_dt}' ${dc_no > 0 ? `AND dc_no = '${dc_no}'` : ''}`,
            order = null;
            var res_dt = await db_Select(select, table_name, whr, order)
            resolve(res_dt)
        })
    },
    getBirdWeight: (dc_no) => {
        return new Promise(async (resolve, reject) => {
            var select = 'id, dc_no, sl_no, nob, weight', 
            table_name = 'td_bird_count',
            whr = `dc_no = '${dc_no}'`,
            order = 'ORDER BY sl_no';
            var res_dt = await db_Select(select, table_name, whr, order)
            resolve(res_dt)
        })
    },
    getLameBirdWeight: (dc_no) => {
        return new Promise(async (resolve, reject) => {
            var select = 'id, dc_no, sl_no, nob, weight', 
            table_name = 'td_lame_bird_count',
            whr = `dc_no = '${dc_no}'`,
            order = 'ORDER BY sl_no';
            var res_dt = await db_Select(select, table_name, whr, order)
            resolve(res_dt)
        })
    }
}