const express = require("express"),
    app = express(),
    expressLayouts = require("express-ejs-layouts"),
    session = require('express-session'),
    path = require("path"),
    port = process.env.PORT || 3000;

app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// SET VIEW ENGINE AND PATH //
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);

app.set("layout", "templates/layout");

// SET ASSETS AS A STATIC PATH //
app.use(express.static(path.join(__dirname, "assets/")));

// CONFIGURE SESSION //
app.use(
    session({
        secret: "Hatchery Admin",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000,
        },
    })
);
// END //

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    // console.log(req.path);
    res.locals.path = req.path;
    res.locals.message = req.session.message;
    delete req.session.message;
    // console.log(req.path);
    next();
});

const { compRouter } = require("./routes/companyRouter");
const { dashRouter } = require("./routes/dashboardRouter");
const { userRouter } = require("./routes/userRoute");

app.use(userRouter)
app.use(dashRouter)
app.use(compRouter)

app.get('/', async (req, res) => {
    // res.send('LALA')
    res.redirect('/login')
})


app.listen(port, (err) => {
    if (err) console.log(err);
    else console.log(`App is running at port ${port}`);
})