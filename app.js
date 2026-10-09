require('dotenv').config();

const express = require('express');
const connection = require('./config/db');
const app = express();
const port = process.env.PORT || 8080;
const userRouter = require('./routes/user.routes');
const expenseRouter = require('./routes/expense.routes');

app.use(express.json());

connection();

app.use('/users', userRouter);
app.use('/expenses', expenseRouter);


app.get('/', (req, res) => {
    res.send("working");
});

app.listen(port, () => {
    console.log(`server is running at port ${port}`);
});