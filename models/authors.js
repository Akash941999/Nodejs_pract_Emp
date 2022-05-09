const mongoose = require("mongoose");
const Books = require('./books.js');
const Schema = mongoose.Schema;


const authors = mongoose.Schema({

    name : String,
    age : Number,
    books:[{ type: Schema.Types.ObjectId, ref: 'Books' }]
});


// export model 
module.exports = mongoose.model("authors", authors);

