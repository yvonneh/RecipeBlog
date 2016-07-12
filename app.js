var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

// APP CONFIG                            
mongoose.connect("mongodb://localhost/restful_recipe_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Schema CONFIG   
var recipeschema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var recipe = mongoose.model("recipe", recipeschema);

// RESTFUL ROUTES

app.get("/", function(req, res){
   res.redirect("/recipes"); 
});

// INDEX ROUTES         
app.get("/recipes", function(req, res){
   recipe.find({}, function(err, recipes){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("index", {recipes: recipes}); 
       }
   });
});

// NEW ROUTE           
app.get("/recipes/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE        
app.post("/recipes", function(req, res){
    // create recipe
    console.log(req.body);
    console.log("===========")
    console.log(req.body);
    recipe.create(req.body.recipe, function(err, newrecipe){
        if(err){
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect("/recipes");
        }
    });
});

// SHOW ROUTE         
app.get("/recipes/:id", function(req, res){
   recipe.findById(req.params.id, function(err, foundrecipe){
       if(err){
           res.redirect("/recipes");
       } else {
           res.render("show", {recipe: foundrecipe});
       }
   })
});

// EDIT ROUTE
app.get("/recipes/:id/edit", function(req, res){
    recipe.findById(req.params.id, function(err, foundrecipe){
        if(err){
            res.redirect("/recipes");
        } else {
            res.render("edit", {recipe: foundrecipe});
        }
    });
})


// UPDATE ROUTE                   
app.put("/recipes/:id", function(req, res){
    req.body.recipe.body = req.sanitize(req.body.recipe.body)
   recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedrecipe){
      if(err){
          res.redirect("/recipes");
      }  else {
          res.redirect("/recipes/" + req.params.id);
      }
   });
});

// DELETE ROUTE                  
app.delete("/recipes/:id", function(req, res){
   //destroy recipe
   recipe.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/recipes");
       } else {
           res.redirect("/recipes");
       }
   })
   //redirect somewhere
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING!");
})

