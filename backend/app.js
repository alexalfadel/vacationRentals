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
            //sign up errors
            if (error.message === "email must be unique") {
                error.message = "User with that email already exists";
                err.message = "User already exists."
            } else err.title = 'Validation error';

            if (error.message === 'username must be unique') {
                error.message = "User with that username already exists";
                err.message = "User already exists";
            }
            //create a spot errors
            if (error.message === 'Spot.address cannot be null') {
                error.message = 'Street address is required',
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Spot.city cannot be null') {
                error.message = 'City is required',
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Spot.state cannot be null') {
                error.message = 'State is required';
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Spot.country cannot be null') {
                error.message = 'Country is required';
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Spot.lat cannot be null') {
                error.message = 'Lattitude is not valid',
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Spot.lng cannot be null') {
                error.message = 'Longitude is not valid';
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Spot.name cannot be null') {
                error.message = 'Name is required';
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Spot.description cannot be null') {
                error.message = 'Description is required';
                err.message  = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Spot.price cannot be null') {
                error.message = 'Price per day is required';
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'Validation len on name failed') {
                error.message = 'Name must be less than 50 characters';
                err.message = 'Bad Request'
                err.status = 400
            }

            if (error.message === 'name must be unique') {
                error.message = 'Name is already taken'
                err.message = 'Bad Request'
                err.status = 400
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

    //log-in errors
    if (err.title === 'Login failed') {
        if (!isProduction) {
            res.json({
                title: err.title,
                message: err.message,
                errors: err.errors,
                stack: err.stack
            })
        } else {
            res.json({
                message: err.message
            })
        }
    }

    //sign-up errors
    if (!isProduction) {
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