const express = require('express');
const { register } = require('../services/user.service');

module.exports.register = async (req, res) => {
    try{

    const response = await register(req.body);

    if(!response){
        return res.status(400).json({
            status : false,
            message : "Error in user creation"
        });
    }

    return res.status(200).json({
        status : true,
        message : "User created successfully"
    });
    }
    catch(err){
        return res.status(400).json({
            status : false,
            message : `Error in user creation - ${err}`
        });
    }
    
}