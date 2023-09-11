const express = require ('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { ValidationError } = require('sequelize');

const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

if (!isProduction) {
    app.use(cors());
}

app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

const routes = require('./routes');

app.use(routes);

app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
});

app.use((err, _req, _res, next) => {
    if (err instanceof ValidationError) {
        let errors = {};
        for (let error of err.errors) {
            if (error.message === "email must be unique") {
                error.message = "User with that email already exists";
                err.message = "User already exists."
            } else err.title = 'Validation error';

            if (error.message === 'username must be unique') {
                error.message = "User with that username already exists";
                err.message = "User already exists";
            }

            
            errors[error.path] = error.message
        }
        // err.title = 'Validation error';
        err.errors = errors;
    }
    next(err);
})

app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    if (!isProduction) {
        // if (err.errors)
        res.json({
            title: err.title || 'Server Error',
            message: err.message,
            errors: err.errors,
            stack: isProduction ? null : err.stack
        })
    } else {
        res.json(
            {
                message: err.message,
                errors: err.errors
            }
        )
    }
    
})



module.exports = app