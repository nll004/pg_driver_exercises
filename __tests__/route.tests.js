process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const {db, uri} = require('../db')

let tstCompany = {};
let tstInvoice = {};

beforeEach(async function(){
    let companyData = await db.query(`
        INSERT INTO companies
        VALUES  ('apple', 'Apple Computer', 'Maker of OSX.'),
                ('ibm', 'IBM', 'Big blue.')
        RETURNING code, name, description`);

    let invoiceData = await db.query(`
        INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
        VALUES ('apple', 100, false, '2018-01-01', null),
               ('apple', 200, true, '2018-02-01', '2018-02-02'),
               ('ibm', 300, false, '2018-03-01', null)
        RETURNING id, amt, comp_code`);
    tstCompany.companies = companyData.rows;
    tstInvoice.invoices = invoiceData.rows;
})
afterEach(async function() {
    await db.query(`DELETE FROM companies`);
});
afterAll(async function() {
  // close db connection
  await db.end();
});

describe('Check if using correct database with tests', function(){
    test('Test for test database URI', function(){
        expect(uri).toEqual('postgresql:///biztime_test')
    })
})
describe('GET /companies', function(){
    test('Test route for a list of all companies', async function(){
        let response = await request(app).get('/companies');
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(tstCompany);
    })
})
describe('GET /companies/:code', function(){
    test('Test route for a single company', async function(){
        let response = await request(app)
            .get(`/companies/${tstCompany.companies[0].code}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual([ tstCompany.companies[0] ])
    })
    test('Test route of error handling', async function(){
        let response = await request(app)
            .get(`/companies/notarealcompanycode`);
        expect(response.statusCode).toEqual(404);
    })
})
describe("POST /companies", function(){
    test("Should allow adding a new company", async function() {
        const response = await request(app)
            .post("/companies")
            .send({company:{
                code: "TG",
                name: "Target",
                description: "American Superstore"}});
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            "created": {
                "code": "TG",
                "name": "Target",
                "description": "American Superstore",
        }});
    })
    test("It should return 500 if conflict", async function () {
        const response = await request(app)
            .post("/companies")
            .send({company:{name: "Apple", description: "Huh?"}});
        expect(response.status).toEqual(500);
      })
});
describe("PUT /companies/:code", function() {
    test("It should update a specific company", async function() {
        const response = await request(app)
            .put(`/companies/${tstCompany.companies[0].code}`)
            .send({company:{name: "Applesauce", description: "Yummy"}});
        expect(response.body).toEqual(
            {"updated": {
                    code: "apple",
                    name: "Applesauce",
                    description: "Yummy",
            }});
    });
});
describe("DELETE /", function() {
    test("It should delete company", async function() {
        const response = await request(app)
            .delete(`/companies/${tstCompany.companies[1].code}`);
        expect(response.body).toEqual({"status": "deleted"});
    });
    test("It should return 404 for no-such-comp", async function () {
        const response = await request(app)
            .delete("/companies/notarealcompany");
        expect(response.status).toEqual(404);
    });
});
