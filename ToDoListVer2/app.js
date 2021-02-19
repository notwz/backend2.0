//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); 


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//--- basic mongoose setup --- 
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true,
useUnifiedTopology: true});

//establishing the schema for a new item object 
const itemsSchema = new mongoose.Schema( {
  name: String
});


//connecting Item - type & declaring it as an itemSchema 
//mongoose models based on our schema 
const Item = mongoose.model("Item", itemsSchema); 

//creating new items 
const item1 = new Item ( { 
  name: "Welcome to your todolist!"
});

const item2 = new Item ( { 
  name: "Hit the + button to add a new item"
});

const item3 = new Item ( { 
  name: "<-- Hit this to delete an item"
});

//adding to arr
const defaultItems = [item1, item2, item3];

// new express routing schema 

const listSchema = { 
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);




app.get("/", function(req, res) {

  //second param is a callback function. 'foundItems' is the variable we create, can be name anything we want. 
  Item.find({}, function (err, foundItems) {

    //console.log(foundItems); 

    // checks to see if the arr is empty, only then will it load data into the arr 
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err); 
        } else {
          console.log("Successfully saved data into the DB!");
        }
      });
      res.redirect("/");
    } else { 
      res.render("list", {listTitle: "Today", newListItems: foundItems});

    }
    
  });


});


//using express routing params
app.get("/:customListName", function(req, res) { 
  const customListName = req.params.customListName;

  List.findOne({name: customListName}, function( err, foundList) {
    if(!err) {
      if (!foundList) {
        //console.log("does not exist");
        //create a new list 
        const list = new List( {
          name: customListName, 
          items: defaultItems
        });
      
        list.save();
        res.redirect("/" + customListName);

      } else {
        //console.log("Exists!");
        //show an existing list 

        res.render("list", { listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });

  

}); 


//adding new items to list
app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  
  
  const item = new Item( {
    name: itemName
  });

  if (listName==="Today") { 
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList) { 
      foundList.items.push(item); 
      foundList.save();
      res.redirect("/" + listName);

    });
  }


});

//deleting items off the list and TB 
app.post("/delete", function(req, res) {

  const checkedItemId = req.body.checkbox; 

  Item.findByIdAndRemove(checkedItemId, function(err) {
    if(!err) { 
      console.log("sucessfuly deleted");
    } 
  });

  res.redirect('/');


})



app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
