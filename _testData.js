const {db} = require("./db");

async function createCompanies() {
    return await db.query(`
        INSERT INTO companies
        VALUES  ('apple', 'Apple Computer', 'Maker of OSX.'),
                ('ibm', 'IBM', 'Big blue.')
        RETURNING code, name, description`);
}

async function createInvoices() {
    return await db.query(`
        INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
        VALUES ('apple', 100, false, '2018-01-01', null),
               ('apple', 200, true, '2018-02-01', '2018-02-02'),
               ('ibm', 300, false, '2018-03-01', null)
        RETURNING id, amt, comp_code`);
}

module.exports = {
    createCompanies : createCompanies,
    createInvoices : createInvoices
}
