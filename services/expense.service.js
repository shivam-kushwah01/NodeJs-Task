const express = require('express');
const User = require('../models/user.model');
const Expense = require('../models/expense.model');

module.exports.createExpense = async (payload) => {

    const { userId, title, amount, categary, description } = payload;

    const user = await User.findById(userId);

    if(!user){
        throw new Error("User didn't exist!!");
    }

    const expense = await Expense.create({
        userId,
        title,
        amount,
        categary,
        description
    });

    return expense;
}

module.exports.findExpenses = async (payload) => {

    const { page = 1, limit = 10, userId, categary} = payload;

    page = Number(page);
    limit = Number(limit);

    if(!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1 || limit > 100){
        throw new Error("Invalid page or limit");
    }

    const filter = {};

    if(userId){
        filter.userId = userId;
    }

    if(categary){
        filter.categary = categary;
    }

    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
        Expense.find(filter).sort({ createdAt : -1}).skip(skip).limit(limit),
        Expense.countDocuments(filter),
    ]);

    return {
        data : expenses,
        pagination : {
            page,
            limit,
            total,
            totalPages :Math.ceil(total / limit),
        }
    }
}

module.exports.findOneExpense = async (payload) => {

    const { expenseId } = payload;

    const expense = await Expense.findById(expenseId);

    if(!expense){
        throw new Error("Expense didn't exists");
    }

    return expense;
}

module.exports.updateExpense = async (payload) => {

    const { expenseId } = payload;
    const { userId, title, amount, categary, description } = payload;

    const expense = await Expense.findById(expenseId);

    if(!expense){
        throw new Error("Expense didn't exists");
    }

    expense.userId = userId ?? expense.userId;
    expense.title = title ?? expense.title;
    expense.amount = amount ?? expense.amount;
    expense.categary = categary ?? expense.categary;
    expense.description = description ?? expense.description;

    await expense.save();

    return expense;
}

module.exports.deleteExpense = async (payload) => {

    const { expenseId } = payload;

    const expense = await Expense.findByIdAndDelete(expenseId);

    if(!expense){
        throw new Error("Expense didn't exists");
    }

    return expense;
}

