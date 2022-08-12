const express = require('express');
const db = require('../db');
const router = new express.Router();

router.get('/', async function(req, resp, next) {
    try{
        let results = await db.query(`SELECT * FROM companies;`)
        return resp.json({companies: results.rows})
    }catch(err){
        console.error(err)
        return next(err)
    }
})

// router.get('/:code', async function(req, resp, next){
//     const code = req.query
//     try{
//         let results = await
//     }
// })




module.exports = router;
