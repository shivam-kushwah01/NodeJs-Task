const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId
    },
    title : {
        type : String        
    },
    amount : {
        type : Number
    },
    categary : {
        type : String
    },
    description : {
        type : String
    }
});


const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;