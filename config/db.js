const mongoose = require("mongoose");

const connection = async (req, res) => {
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB connection successful');
    }
    catch(err){
        return new Error(`DB connection error ${err}`);
    }
}

module.exports = connection;