const exp = require("express");
const app = exp();
const moon = require("mongoose");
const mo = require("method-override");
const jsdom = require('jsdom');
const sesh = require("express-session")
$ = require("jquery")(new jsdom.JSDOM().window);


app.set("view engine", "ejs");
app.use(exp.urlencoded({ extended: true }));
app.use(exp.static("resources"));
app.use(mo("_method"));

app.use(exp.json({
    type: ["application/json", "text/plain"]
}))

app.use(sesh({
    secret: "bob",
    resave: false,
    cookie: {name: "Trippet", login: false, maxAge: 86400000, secure: true}
}))

moon.connect("mongodb://localhost:27017/Project", {useNewUrlParser: true, useUnifiedTopology: true}).then();

const UserSchema = new moon.Schema({
    user: String,
    pass: String,
    age: Number,
    session: {}
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
    Msg.find({message: {$gt:0}}, (err, data) => {
        if (err){
            res.send("404 - site not found");
        }else{
            res.render("main", {data: data, req: req, res: res});
        }
    })
})

app.get("/create", (req, res) => {
    res.render("create")
});



app.post("/create", (req, res) => {

    //TODO Check for existing user
    let error = User.findOne({usr: req.body.user, pass: req.body.pass, age: req.body.age})
    if(User.find({usr: req.body.user, pass: req.body.pass, age: req.body.age}).count() > 0)
    {
        let usr = req.body.user;
        let pass = req.body.pass;
        let age = req.body.age;

        User.create({
            user: usr,
            pass: pass,
            age: age,
            session: {}
        }).then();

        res.redirect('/')

    }
    else {
        switch(error){
            case error: res.send(error)
        }
    }


});

app.post("/", (req, res) => {

    let user

    if (!req.session.username) {
        user = "Anonymous User"
        console.log(req.session)
    } else {
        console.log(req.session.cookie)
        user = req.session.username
    }

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //Januari är 0!
    let yyyy = today.getFullYear();
    //TODO Add minutes before everything
    //console.log(dd + '/' + mm + '/' + yyyy)


    Msg.create({
        User: user,
        to: "Main",
        date: dd + '/' + mm + '/' + yyyy,
        message: req.body.message
    })

    res.redirect('/')
})

//LOGIN ROUTE
app.get("/loginpage", (req, res) => {
    res.render("login")
})

app.get("/login", (req, res) => {
    //If no username is found
    if(!req.session.username) {
        console.log(req.session)
        res.redirect("loginpage")
    }
    //Otherwise return them to main page
    else{
        console.log("You have been logged in")
        req.session.cookie.login = true
        res.redirect("/")
    }
})

app.post("/login", (req, res) => {

    const username = req.body.usrInput
    const password = req.body.passInput

    console.log(req.body)

    if (User.find({user: username, pass: password})) {
        console.log("Found User")
        req.session.username = username
        return res.redirect("/")
    }
    console.log("Did not find user: " + username + " with pass: " + password)
    res.redirect("/login")
})

//SHOW ROUTE
app.get("/main/:id", (req,res)=>{
    User.findById(req.params.id, (err, data)=>{
        if(err){
            res.send("Profile not found")
        }else{
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
        age:req.body.age,
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
    });
    exit.on("click", (e) => {
        dimmer.hide()
    })
});


app.listen(3000, (err) =>{
    if (err) console.log(err);
    else console.log("Connected to Server")
})

