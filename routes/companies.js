const express = require('express');
const router = new express.Router();

router.get('/', (req, resp) => {
    return resp.json('Working')
})


module.exports = router;
