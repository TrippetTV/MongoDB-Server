const exp = require("express");
const app = exp();
const bp = require("body-parser")
const moon = require("mongoose");
const mo = require("method-override");
const jsdom = require('jsdom');
$ = require("jquery")(new jsdom.JSDOM().window);


app.set("view engine", "ejs");
app.use(exp.urlencoded({ extended: true }));
app.use(exp.static("resources"));
app.use(mo("_method"));

moon.connect("mongodb://localhost:27017/Users", { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new moon.Schema({
    user: String,
    pass: String,
    fName: String,
    eName: String,
    age: Number,
    inS: Boolean,
});

let User = moon.model("User", UserSchema);

const msgSchema = new moon.Schema({
    from: String,
    to: String,
    date: Date,
    message: String
})

let msg = moon.model("msg", msgSchema)

app.get("/main", (req, res) => {
    res.render("main")
})

app.get("/", (req, res) => {
    res.redirect("/main")
})

app.get("/create", (req, res) => {
    res.render("/create");
})

app.get("/index", (req, res) => {
    User.find({}, (err, data) => {
        if (err){
            res.send("404 - site not found");
        }else{
            let bob = data;
            console.log(data);
            res.render("index", {data: bob});
        }
    })
})

app.post("/index", (req, res) => {
    console.log(req.body);
    let usr = req.body.user;
    let pass = req.body.pass;
    let fName = req.body.fName;
    let eName = req.body.eName;
    let age = req.body.age;
    let inS = req.body.inS;

    User.create({
        usr: usr,
        pass: pass,
        fName: fName,
        eName: eName,
        age: age,
        inS: inS,
    });
    res.redirect('/')
});

//SHOW ROUTE
app.get("/index/:id", (req,res)=>{
    User.findById(req.params.id, (err, data)=>{
        if(err){
            res.send("Profile not found")
        }else{
            console.log();
            res.render("show", {data:data})
        }
    })
})

//UPDATE ROUTE
app.get('/index/:id/edit', (req, res)=>{
    User.findById(req.params.id, (err, data)=>{
        if(err){
            console.log(err);
            res.send('Something went wrong')
        }else{
            res.render('edit', {data: data})
        }
    })
})
app.put('/index/:id', async (req, res)=>{
    await User.findByIdAndUpdate(req.params.id, {
        usr:req.body.usr,
        pass:req.body.pass,
        fName:req.body.fName,
        eName:req.body.eName,
        age:req.body.age,
        inS:req.body.inS
    })
    res.redirect('/')
})

//DELETE ROUTE
app.get('/index/:id/delete', (req, res)=>{
    res.render('delete', {id:req.params.id})
})
app.delete('/index/:id', async (req, res)=>{
    await User.findByIdAndDelete(req.params.id, (err)=>{
        if(err){
            console.log(err)
            res.send('Något gick fel')
        }
        else{
            res.redirect('/')
        }
    })
})

$(app.get("post", (req, res) => {
    const button = document.querySelector("#post-create")
    const dimmer = $('.dimmer');
    button.on("click", (e) => {
        dimmer.show()
    });
    exit.on("click", (e) => {
        dimmer.hide()
    })
}));



app.listen(3000, (err) => {
    if (err) {
        console.log(err);
        console.log("någonting blev fel");
    }
    else {
        console.log("Connected");
    }
});