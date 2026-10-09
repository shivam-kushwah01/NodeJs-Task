const express = require('express');
const { isValidObjectId } = require('mongoose');

module.exports.expenseValidation = async (req, res, next) => {
    const { userId, title, amount, categary } = req.body;

    if(isValidObjectId(userId)){
        return res.status(400).json({
            status : false,
            message : "A valid UserID required!!"
        });
    }

    if(typeof title !== "string"){
        return res.status(400).json({
            status : false,
            message : "Title is required"
        });
    }

    if(amount === undefined || amount === null || amount === "" || !Number.isFinite(amount) || amount <= 0){
        return res.status(400).json({
            status : false,
            message : "Amount must be a number!!"
        });
    }

    if(typeof categary !== "string"){
        return res.status(400).json({
            status : false,
            message : "Categary is required"
        });
    }

    next();
}