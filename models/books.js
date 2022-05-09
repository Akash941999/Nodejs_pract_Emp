const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');

const books = mongoose.Schema({

    name : String,
    page : Number
});

// export model
books.plugin(mongoosePaginate); 
module.exports = mongoose.model("books", books);

