const express = require('express');
const { createExpense, findExpenses, findOneExpense, updateExpense, deleteExpense } = require('../services/expense.service');

module.exports.createExpense = async (req, res) => {
    try{
    const response = await createExpense(req.body);

    if(!response){
        return res.status(400).json({
            status : false,
            message : "Error in expense creation!!"
        });
    }

    return res.status(200).json({
        status : true,
        message : "Expense added successfully"
    });
    }
    catch(err){
        return res.status(500).json({
        status : true,
        message : `Error in Expense Creation - ${err}`
    });
    }
}

module.exports.findExpenses = async (req, res) => {
    try{
    const response = await findExpenses(req.body);

    if(!response){
        return res.status(400).json({
            status : false,
            message : "Error in expense creation!!"
        });
    }

    return res.status(200).json({
        status : true,
        message : "Expense added successfully"
    });
    }
    catch(err){
        return res.status(500).json({
        status : true,
        message : `Error in Expense Creation - ${err}`
    });
    }
}

module.exports.findOneExpense = async (req, res) => {
    try{
    const response = await findOneExpense(req.body);

    return res.status(200).json({
        status : true,
        message : "Expense found successfully"
    });
    }
    catch(err){
        return res.status(500).json({
        status : true,
        message : `Error in Expense finding - ${err}`
    });
    }
}

module.exports.updateExpense = async (req, res) => {
    try{
    const response = await updateExpense(req.body);

    return res.status(200).json({
        status : true,
        message : "Expense updated successfully"
    });
    }
    catch(err){
        return res.status(500).json({
        status : true,
        message : `Error in Expense updation - ${err}`
    });
    }
}

module.exports.deleteExpenses = async (req, res) => {
    try{
    const response = await deleteExpense(req.body);

    return res.status(200).json({
        status : true,
        message : "Expense deleted successfully"
    });
    }
    catch(err){
        return res.status(500).json({
        status : true,
        message : `Error in Expense Creation - ${err}`
    });
    }
}