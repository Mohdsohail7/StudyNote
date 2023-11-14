const mongoose = require("mongoose");
require("dotenv").config();



exports.dbconnect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then( () => console.log("DB Connection Successfully"))
    .catch( (err) => {
        console.log("DB Connetion Failed");
        console.error(err);
        process.exit(1);
    })
}