'use strict';

const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController.js');
const verifyRoles = require('../../middleware/verifyRoles.js');
const roles_list = require('../../config/roles_list.js');

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(verifyRoles(roles_list.admin, roles_list.editor), employeesController.createNewEmployee)
    .put(verifyRoles(roles_list.admin, roles_list.editor), employeesController.updateEmployee)
    .delete(verifyRoles(roles_list.admin), employeesController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;