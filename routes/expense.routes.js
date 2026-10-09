const express = require('express');
const { createExpense, findExpenses, findOneExpense, updateExpense, deleteExpenses } = require('../controllers/expense.controller');
const { expenseValidation } = require('../validations/expense.validation');
const Router = express.Router();

Router.post('/', expenseValidation,createExpense); // create expense

Router.get('/', findExpenses); // get expenses

Router.get('/:id', findOneExpense);

Router.put('/:id', updateExpense);

Router.delete('/:id', deleteExpenses);

module.exports = Router;