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
    console.log(User.findOne({}, { usr: 1, pass: 1, fName: 1, eName: 1, age: 1}))
    if(!User.findOne({}, { usr: 1, pass: 1, fName: 1, eName: 1, age: 1}) == null)
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


/*Query {
  _mongooseOptions: {},
  _transforms: [],
  _hooks: Kareem { _pres: Map {}, _posts: Map {} },
  _executionCount: 0,
  mongooseCollection: NativeCollection {
    collection: Collection { s: [Object] },
    Promise: [Function: Promise],
    _closed: false,
    opts: {
      schemaUserProvidedOptions: {},
      capped: false,
      autoCreate: undefined,
      Promise: [Function: Promise],
      '$wasForceClosed': undefined
    },
    name: 'users',
    collectionName: 'users',
    conn: NativeConnection {
      base: [Mongoose],
      collections: [Object],
      models: [Object],
      config: [Object],
      replica: false,
      options: null,
      otherDbs: [],
      relatedDbs: {},
      states: [Object: null prototype],
      _readyState: 1,
      _closeCalled: false,
      _hasOpened: true,
      plugins: [],
      id: 0,
      _listening: false,
      _connectionString: 'mongodb://localhost:27017/Project',
      _connectionOptions: [Object],
      name: 'Project',
      host: 'localhost',
      port: 27017,
      user: undefined,
      pass: undefined,
      client: [MongoClient],
      '$initialConnection': [Promise],
      db: [Db]
    },
    queue: [],
    buffer: false,
    emitter: EventEmitter {
      _events: [Object: null prototype] {},
      _eventsCount: 0,
      _maxListeners: undefined,
      [Symbol(kCapture)]: false
    }
  },
  model: Model { User },
  schema: Schema {
    obj: {
      user: [Function: String],
      pass: [Function: String],
      fName: [Function: String],
      eName: [Function: String],
      age: [Function: Number]
    },
    paths: {
      user: [SchemaString],
      pass: [SchemaString],
      fName: [SchemaString],
      eName: [SchemaString],
      age: [SchemaNumber],
      _id: [ObjectId],
      __v: [SchemaNumber]
    },
    aliases: {},
    subpaths: {},
    virtuals: { id: [VirtualType] },
    singleNestedPaths: {},
    nested: {},
    inherits: {},
    callQueue: [],
    _indexes: [],
    methods: {},
    methodOptions: {},
    statics: {},
    tree: {
      user: [Function: String],
      pass: [Function: String],
      fName: [Function: String],
      eName: [Function: String],
      age: [Function: Number],
      _id: [Object],
      __v: [Function: Number],
      id: [VirtualType]
    },
    query: {},
    childSchemas: [],
    plugins: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    '$id': 1,
    s: { hooks: [Kareem] },
    _userProvidedOptions: {},
    options: {
      typePojoToMixed: true,
      typeKey: 'type',
      id: true,
      noVirtualId: false,
      _id: true,
      noId: false,
      validateBeforeSave: true,
      read: null,
      shardKey: null,
      autoIndex: null,
      minimize: true,
      discriminatorKey: '__t',
      optimisticConcurrency: false,
      versionKey: '__v',
      capped: false,
      bufferCommands: true,
      strictQuery: false,
      strict: true,
      pluralization: true
    },
    '$globalPluginsApplied': true
  },
  op: 'findOne',
  options: {},
  _conditions: {},
  _fields: { usr: 1, pass: 1, fName: 1, eName: 1, age: 1 },
  _update: undefined,
  _path: undefined,
  _distinct: undefined,
  _collection: NodeCollection {
    collection: NativeCollection {
      collection: [Collection],
      Promise: [Function: Promise],
      _closed: false,
      opts: [Object],
      name: 'users',
      collectionName: 'users',
      conn: [NativeConnection],
      queue: [],
      buffer: false,
      emitter: [EventEmitter]
    },
    collectionName: 'users'
  },
  _traceFunction: undefined,
  '$useProjection': true,
  _userProvidedFields: { usr: 1, pass: 1, fName: 1, eName: 1, age: 1 }
}
*/