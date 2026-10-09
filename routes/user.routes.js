const express = require('express');
const { userValidation } = require('../validations/user.validation');
const { register } = require('../controllers/user.controller');

const Router = express.Router();

Router.post('/register', userValidation, register);

module.exports = Router;