'use strict';

const Employee = require('../model/Employee.js');

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ message: 'No employees found' });
    res.json(employees);
};

const createNewEmployee = async (req, res) => {
    if (!req?.body?.name || !req?.body?.city) return res.status(400).json({ 'message': 'name and city are required' });
    try {
        const result = await Employee.create({
            name: req.body?.name,
            city: req.body?.city
        })
        res.status(201).json(result);
    } catch (error) {
        res.json({ message: error });
    }
};

const updateEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required' });
    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) return res.status(204).json({ 'message': 'Employee not found' });
    if (req.body?.name) employee.name = req.body.name;
    if (req.body?.city) employee.city = req.body.city;
    try {
        const result = await employee.save(); 
        res.status(201).json(result);
    } catch (err) {
        res.json({ message: err });
    }
};

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required' });
    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) return res.status(204).json({ 'message': 'Employee not found' });
    await Employee.deleteOne({ _id: req.body.id });
    res.sendStatus(204);
};

const getEmployee = async (req, res) => {
    if (!(req?.params?.id)) return res.status(400).json({ 'message': 'Employee ID required' });
    const employee = await Employee.findOne({ _id: req.params?.id }).exec();
    if (!employee) return res.status(400).json({ 'message': 'Employee not found' });
    res.json(employee);
};

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
};