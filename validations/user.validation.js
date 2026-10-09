const express = require('express');

module.exports.userValidation = async (req, res, next) => {
    const { name, email } = req.body;

    if(typeof name !== "string"){
        return res.status(400).json({
            status : false,
            message : "Name must be string!!"
        });
    }

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;

    if(typeof email !== "string" || !pattern.test(email.trim())){
        return res.status(400).json({
            success : false,
            message : "Email is not valid"
        });
    }

    next();
}