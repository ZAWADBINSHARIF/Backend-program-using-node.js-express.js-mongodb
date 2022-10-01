const express = require('express');
const router = express.Router();
const path = require('path');

const data = {};
data.employees = require(path.join(__dirname, '..', '..', 'data', 'employees.json'));

router.route('/')
    .get((req, res) => {
        res.json(data.employees);
    })
    .post((req, res) => {
        res.json({
            "name": req.body.name,
            "city": req.body.city
        });
    })
    .put((req, res) => {
        res.json({
            "name": req.body.name,
            "city": req.body.city
        });
    })
    .delete((req, res) => {
        res.json({
            "id": req.body.id
        });
    });

router.route('/:id')
    .get((req, res) => {
        res.json({ "id": req.params.id });
    });

module.exports = router;