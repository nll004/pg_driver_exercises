process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const { db, DB_URI } = require('../db.js')

let tstCompany;
let tstInvoice;

beforeEach(async function(){
    let res = await db.query(`INSERT INTO companies VALUES ('apple', 'Apple Computer', 'Maker of OSX.'), ('ibm', 'IBM', 'Big blue.')`)
    tstCompany = res.rows;
})

// afterEach(async function() {
//     // delete any data created by test
//     await db.query("DELETE FROM companies");
// });

// afterAll(async function() {
//   // close db connection
//   await db.end();
// });

describe('Check for using test database', function(){
    test('Test for test database URI', function(){
        expect(DB_URI).toEqual('postgresql:///biztime_test')
    })
})

// describe('GET /companies', function(){
//     test('Test for a list of companies', function(){

//         expect()
//     })
// })
