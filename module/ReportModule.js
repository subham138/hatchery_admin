const { db_Select } = require("./MasterModule");
const dateFormat = require("dateformat")

module.exports = {
    allCollectionList: (comp_id, frm_dt, to_dt, dc_no = 0) => {
        return new Promise(async (resolve, reject) => {
            var select = 'a.dc_no, a.trader_id, a.farmer_id, a.site_id, a.super_id, a.schedule_no, a.entry_date, a.scale_no, a.vehicle_no, a.driver_id, a.slip_no, a.lot_no, a.str_dt, a.end_dt, a.avg_weight, a.remarks, (SELECT SUM(b.nob) FROM td_bird_count b WHERE a.dc_no=b.dc_no AND a.schedule_no=b.schedule_no) net_qty, (SELECT SUM(b.weight) FROM td_bird_count b WHERE a.dc_no=b.dc_no AND a.schedule_no=b.schedule_no) net_weight, (SELECT SUM(b.weight) FROM td_lame_bird_count b WHERE a.dc_no=b.dc_no AND a.schedule_no=b.schedule_no) tot_lm_weg, (SELECT SUM(b.nob) FROM td_lame_bird_count b WHERE a.dc_no=b.dc_no AND a.schedule_no=b.schedule_no) tot_lm_net', 
            table_name = 'td_collection a',
            whr = dc_no > 0 ? `a.dc_no = '${dc_no}'` : `a.entry_date BETWEEN '${frm_dt}' AND '${to_dt}' AND a.comp_id = ${comp_id}`,
            order = null;
            var res_dt = await db_Select(select, table_name, whr, order)
			console.log(res_dt)
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