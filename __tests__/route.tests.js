process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const {db, uri} = require('../db')

let tstCompany = {};
let tstInvoice = {};

beforeEach(async function(){
    let resp = await db.query(`
    INSERT INTO companies
    VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
    ('ibm', 'IBM', 'Big blue.')
    RETURNING code, name, description`)
    tstCompany.companies = resp.rows;
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
        let response = await request(app).get(`/companies/${tstCompany.companies[0].code}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual([ tstCompany.companies[0] ])
    })
    test('Test route of error handling', async function(){
        let response = await request(app).get(`/companies/haidahgetia`);
        expect(response.statusCode).toEqual(404);
    })
})
