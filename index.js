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

moon.connect("mongodb://localhost:27017/Project", { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new moon.Schema({
    user: String,
    pass: String,
    fName: String,
    eName: String,
    age: Number,
});

let User = moon.model("User", UserSchema);

const msgSchema = new moon.Schema({
    User: String,
    to: String,
    date: Date,
    message: String
})

let Msg = moon.model("Msg", msgSchema)

app.get("/", (req, res) => {
    res.redirect("/main")
});

app.get("/main", (req, res) => {
    Msg.find({}, (err, data) => {
        if (err){
            res.send("404 - site not found");
        }else{
            console.log(data);
            res.render("main", {data: data});
        }
    })
})

app.get("/create", (req, res) => {
    res.render("create")
});



app.post("/", (req, res) => {

    //TODO Check for existing user
    console.log(req.body);
    let usr = req.body.user;
    let pass = req.body.pass;
    let fName = req.body.fName;
    let eName = req.body.eName;
    let age = req.body.age;

    User.create({
        usr: usr,
        pass: pass,
        fName: fName,
        eName: eName,
        age: age,
    });
    res.redirect('/')
});

app.post("/", (req, res) => {

    let user

    if (!req.body.user) {
        user = "Anonymous User"
    } else {
        user = req.body.user
    }

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //Januari är 0!
    let yyyy = today.getFullYear();
    //TODO Add minutes before everything
    console.log(dd + '/' + mm + '/' + yyyy)

    Msg.create({
        User: user,
        to: "Main",
        date: dd + '/' + mm + '/' + yyyy,
        message: String
    })

    res.redirect('/')
})

//SHOW ROUTE
app.get("/main/:id", (req,res)=>{
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
app.get('/main/:id/edit', (req, res)=>{
    User.findById(req.params.id, (err, data)=>{
        if(err){
            console.log(err);
            res.send('Something went wrong')
        }else{
            res.render('edit', {data: data})
        }
    })
})

app.put('/main/:id', async (req, res)=>{
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
app.get('/main/:id/delete', (req, res)=>{
    res.render('delete', {id:req.params.id})
})

app.delete('/main/:id', async (req, res)=>{
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

app.get("post", (req, res) => {
    const button = document.querySelector("#post-create")
    const dimmer = $('.dimmer');
    button.on("click", (e) => {
        dimmer.show()
        let txtarea = document.createElement("textarea")
        txtarea.width = "300px"
        txtarea.height = "200px"
        document.appendChild(txtarea)
    });
    exit.on("click", (e) => {
        dimmer.hide()
    })
});


app.listen(3000, (err) => {
    if (err) {
        console.log(err);
        console.log("någonting blev fel");
    }
    else {
        console.log("Connected");
    }
});