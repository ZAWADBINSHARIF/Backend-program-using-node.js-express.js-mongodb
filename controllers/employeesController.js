const data = {
    employees: require('../model/employees.json'),
    setEmployee: function (newData) { this.employees = newData; }
};

const getAllEmployees = (req, res) => {
    res.json(data.employees);
};

const createNewEmployee = (req, res) => {
    const newEmployee = {
        id: data.employees?.length ? data.employees[data.employees.length - 1].id + 1 : 1,
        name: req.body.name,
        city: req.body.city
    };

    if (!newEmployee.name || !newEmployee.city) {
        return res.status(400).json({
            'message': 'name and city are required'
        });
    };

    data.setEmployee([...data.employees, newEmployee]);
    res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
    const employee = data.employees?.find(employee => employee.id === parseInt(req.body.id));
    if (!employee) return res.status(400).json({ 'message': 'Employee not found' });
    if (req.body.name) employee.name = req.body.name;
    if (req.body.city) employee.city = req.body.city;
    const filterArray = data.employees.filter(employee => employee.id !== req.body.id);
    const unsortedArray = [...filterArray, employee];
    const sortedArray = unsortedArray.sort((a, b) => a.id - b.id);
    data.setEmployee(sortedArray)
    res.json(data.employees);
};

const deleteEmployee = (req, res) => {
    const employee = data.employees?.find(employee => employee.id === parseInt(req.body.id));
    if (!employee) return res.status(400).json({ 'message': `Employee id ${req.body.id} not found` });
    const filterArray = data.employees.filter(employee => employee.id !== parseInt(req.body.id));
    data.setEmployee(filterArray);
    res.json(data.employees);
};

const getEmployee = (req, res) => {
    const employee = data.employees?.find(employee => employee.id === parseInt(req.params.id));
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