const { db_Select, db_Insert } = require("./MasterModule")
const dateFormat = require("dateformat");

module.exports = {
    getCompanyDtls: (id = 0) => {
        return new Promise(async (resolve, reject) => {
            var select = 'id, ucrc, name, address, contact_person, phone_no, email, no_of_mechine, no_of_user, amc_start, amc_end, active_flag', 
            table_name = 'md_company', 
            whr = id > 0 ? `id = '${id}'` : null,
            order = null;
            var res_dt = await db_Select(select, table_name, whr, order)
            resolve(res_dt)
        })
    },
    saveCompanyData: (data, user_name) => {
        return new Promise(async (resolve, reject) => {
            var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
            var table_name = 'md_company',
            fields = data.id > 0 ? `name = '${data.name}', address = '${data.address}', 
            contact_person = '${data.contact_person}', phone_no = '${data.phone_no}', 
            email = '${data.email}', no_of_mechine = '${data.no_of_mechine}', 
            no_of_user = '${data.no_of_mechine}', amc_start = '${data.amc_start}', 
            amc_end = '${data.amc_end}', modified_by = '${user_name}', modified_dt = '${datetime}'` : 
            `(ucrc, name, address, contact_person, phone_no, email, no_of_mechine, no_of_user, amc_start, 
                amc_end, created_by, created_dt)`,
            values = `('${data.ucrc}', '${data.name}', '${data.address}', '${data.contact_person}', 
            '${data.phone_no}', '${data.email}', '${data.no_of_mechine}','${data.amc_start}', 
            '${data.amc_end}', '${user_name}', '${datetime}')`,
            whr = data.id > 0 ? `id = ${data.id}` : null,
            flag = data.id > 0 ? 1 : 0;
            var res_dt = await db_Insert(table_name, fields, values, whr, flag);
            resolve(res_dt)
        })
    }
}