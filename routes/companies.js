const express = require('express');
const { db } = require('../db');
const ExpressError = require('../expressError');
const router = new express.Router();

router.get('/', async function(req, resp, next) {
    try {
        const results = await db.query(`SELECT * FROM companies`)
        return resp.json({companies: results.rows})
    }catch(err){
        return next(err)
    }
})

router.get('/:code', async function(req, resp, next){
    try{
        const {code} = req.params
        const companyInfo = await db.query(`SELECT * FROM companies WHERE code=$1`, [code])
        if(companyInfo.rows.length === 0){
            throw new ExpressError("Company not found", 404)
        }
        return resp.json(companyInfo.rows)
    }catch(err){
        return next(err)
    }
})

router.post('/', async function(req, resp, next){
    try{
        const company = req.body.company
        console.log(company)
        const results = await db.query(`
            INSERT INTO companies (code, name, description )
            VALUES ($1, $2, $3)
            RETURNING code, name, description`,
            [company.code, company.name, company.description])
        return resp.json({ created: results.rows[0]})
    }catch(err){
        // Potential errors that need handling.
        // Trying to recreate an existing company
        // Failed to create the company
        // Uppercase vs lowercase company codes
        return next(err)
    }
})
router.put('/:code', async function(req, resp, next){
    try{
        const companyCode = req.params.code
        const newData = req.body.company
        const company = await db.query(`SELECT * FROM companies WHERE code=$1`, [companyCode]);
        if(company.rows.length === 0){
            throw new ExpressError("Company not found", 404)
        }
        const editedComp = await db.query(`UPDATE companies
            SET name=$1, description=$2
            WHERE code=$3
            RETURNING code, name, description`,
            [newData.name, newData.description, companyCode])
        return resp.json({updated: editedComp.rows[0]})
    }catch(err){
        return next(err)
    }
})
router.delete('/:code', async function(req, resp, next){
    try{
        const companyCode = req.params.code
        const company = await db.query(`SELECT * FROM companies WHERE code=$1`, [companyCode]);
        if(company.rows.length === 0){
            throw new ExpressError("Company not found", 404)
        }
        await db.query(`DELETE FROM companies WHERE code=$1`, [companyCode]);
        return resp.json({status: "deleted"})
    }catch(err){
        return next(err)
    }
})

module.exports = router;
