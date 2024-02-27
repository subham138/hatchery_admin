const { db_Insert } = require("./MasterModule"),
dateFormat = require('dateformat');

module.exports = {
  updateCollection: (data, user) => {
    return new Promise(async (resolve, reject) => {
      var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      var res_dt;
      if (Array.isArray(data.bird)) {
        for (let id of data.bird) {
          var table_name = "td_bird_count",
            fields = `nob = '${data[`nob_${id}`]}', weight = '${data[`weight_${id}`]}', modified_by = '${user}', modified_dt = '${datetime}'`,
            values = null,
            whr = `sl_no = ${id} AND dc_no ='${data.dc_no}' AND schedule_no = '${data.schedule_no}'`,
            flag = 1;
          res_dt = await db_Insert(table_name, fields, values, whr, flag);
        }
      }else{
        var table_name = "td_bird_count",
            fields = `nob = '${data[`nob_${data.bird}`]}', weight = '${data[`weight_${data.bird}`]}', modified_by = '${user}', modified_dt = '${datetime}'`,
            values = null,
            whr = `sl_no = ${data.bird} AND dc_no ='${data.dc_no}' AND schedule_no = '${data.schedule_no}'`,
            flag = 1;
          res_dt = await db_Insert(table_name, fields, values, whr, flag);
      }

      if (Array.isArray(data.lame_bird)) {
        for (let id of data.lame_bird) {
          var table_name = "td_lame_bird_count",
            fields = `nob = '${data[`lame_nob_${id}`]}', weight = '${data[`lame_weight_${id}`]}', modified_by = '${user}', modified_dt = '${datetime}'`,
            values = null,
            whr = `sl_no = ${id} AND dc_no = '${data.dc_no}' AND schedule_no = '${data.schedule_no}'`,
            flag = 1;
          res_dt = await db_Insert(table_name, fields, values, whr, flag);
        }
      }else{
        var table_name = "td_lame_bird_count",
            fields = `nob = '${data[`lame_nob_${data.lame_bird}`]}', weight = '${data[`lame_weight_${data.lame_bird}`]}', modified_by = '${user}', modified_dt = '${datetime}'`,
            values = null,
            whr = `sl_no = ${data.lame_bird} AND dc_no ='${data.dc_no}' AND schedule_no = '${data.schedule_no}'`,
            flag = 1;
          res_dt = await db_Insert(table_name, fields, values, whr, flag);
      }

      resolve(res_dt);
    });
  },
};
