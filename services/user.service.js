const express = require('express');
const User = require('../models/user.model');

module.exports.register = async (payload) => {
    const { name , email } = payload;

    const user = await User.findOne({ email });

    if(user){
        return new Error('User Already exists!!');
    }

    await User.create({
        name,
        email
    });

    return user;
 
}