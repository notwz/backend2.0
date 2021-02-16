
//require the mongoose package 
const mongoose = require("mongoose");

//creating new DB called fruitsDB
//has the new Server Discover and Monitoring engine passed in 2nd param
mongoose.connect("mongodb://localhost:27017/fruitsDB", {useNewUrlParser: true, useUnifiedTopology: true});


// --- replaces the insertDocument code of MongoDB ---- 
//creating schema
//tells the name of attribute and its datatype
const fruitSchema = new mongoose.Schema( { 
    name: String, 
    rating: Number,
    review: String
});

//create mongoose model
//will automatically create collection of plural version of Fruit => fruits 
const Fruit = mongoose.model("Fruit", fruitSchema);

//create fruit document 
const fruit = new Fruit ( {
    name: "Apple",
    rating: 7,
    review: "Pretty solid as a fruit"
});

//comment out so you dont save the same data every time you run app.js
//fruit.save(); 

// --- end --- 

const personSchema = new mongoose.Schema( {
    name: String, 
    age: Number
});

const Person = mongoose.model("Person", personSchema); 

const person = new Person( {
    name: "John",
    age: 37
});

//person.save(); 


//lets add 2+ documents into DB - fruits collection 
const kiwi = new Fruit( {
    name: "Kiwi",
    score: 10,
    review: "Best fruit!"

});

const orange = new Fruit({
    name: "Orange",
    score: 4,
    review: "Too sour for me"
});

//adding multiple documents 
//second param is a error callback function
/* Fruit.insertMany([kiwi, orange], function(err) {
    if(err) {
        console.log(err);

    } else {
        console.log("Successfully added to FruitsDB");
    }
}); */

//reading from database w/ mongoose
//in terminal, node app.js, will run the code below and show all docs in fruits collection 
//returns an array of fruits, each w. own properties -> can use arr f(x)

Fruit.find( function(err, fruits) {
    if (err) {
        console.log(err);
    } else {
        //important to close our connections
        //does not matter where we put this because it is in callback function
        //we already recieved the data from the fruitsDB 
        mongoose.connection.close();
        
        //looping thru the fruit arr and returning only the name
        fruits.forEach(function(fruit) {
            console.log(fruit.name); 

        });
    }
});

//Data Validation 

//limits rating from 1 to 10 => err if out of bounds
const fruitSchema = new mongoose.Schema( { 
    //requires the name field , 2nd param is err msg 
    name: {
        type: String,
        required: [true, "Please check your entry, no name specified!"],
    }, 
    rating: {
        type: Number,
        min: 1,
        max: 10
    },
    review: String
});
//forget to put name? see above

//Updating and Deleting Data 

//updating by adding the name Peach to docu
Fruit.updateOne({_id: "copy and paste the ID in shell"}, {name: "Peach"}, function(err) {
    if(err){
        console.log(err);
    } else {
        console.log("Successfully updated document!");
    }
});

//deleting the peach 
Fruit.deleteOne( { name: "Peach"}, function(err) { 
    if(err) {
        console.log(err); 
    } else {
        console.log("Successfully deleted the document!");
    }
});

//deleting many 
People.deleteMany({ name: "John"}, function(err) { 
    if(err) { 
        console.log(err);
    } else {
        console.log("Deleted many!");
    }
});