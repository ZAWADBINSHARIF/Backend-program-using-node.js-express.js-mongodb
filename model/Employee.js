'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Employee', employeesSchema);