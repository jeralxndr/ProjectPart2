//const { Collection, default: mongoose } = require("mongoose");

const mongoose = require("mongoose");

let dhikrModel = mongoose.Schema({
    Name: String,
    content: String,
    category: String,
    reward: String,
    timesRecited: Number
},
{
    collection:"Bio_dhikr"
});
module.exports =mongoose.model('Dhikr',dhikrModel);
