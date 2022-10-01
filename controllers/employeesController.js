const data = {
    employees: require('../model/employees.json'),
    setEmployee: function (newData) { this.employees = newData; }
};

const getAllEmployees = (req, res) => {
    res.json(data.employees);
};

const createNewEmployee = (req, res) => {
    res.json({
        "name": req.body.name,
        "city": req.body.city
    });
};

const updateEmployee = (req, res) => {
    res.json({
        "name": req.body.name,
        "city": req.body.city
    });
};

const deleteEmployee = (req, res) => {
    res.json({
        "id": req.body.id
    });
};

const getEmployee = (req, res) => {
    res.json({ "id": req.params.id });
};

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
};