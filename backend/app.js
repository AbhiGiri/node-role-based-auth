const express = require('express');
const { connect } = require('mongoose');
const cors = require('cors');
const {success, error} = require('consola');
const passport = require('passport');

const { DB, PORT } = require('./config');

//initilize the app
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize())

require('./middlewares/passport')(passport);

//route
app.use('/api/users', require('./routes/users.route'));


const startApp = async () => {
    try {
        await connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        success({
            message: `Successfully connected with the DB \n${DB}`,
            badge: true
        });
        app.listen(PORT, () => {
            success({
                message: `Server started at port ${PORT}`,
                badge: true
            })
        });
    }
    catch (err) {
        error({
            message: `unable to connect with DB \n${err}`,
            badge: true
        });
    startApp();    
    }
}

startApp();