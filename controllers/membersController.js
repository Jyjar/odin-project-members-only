const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const passport = require("../db/passport.js");

async function getMessages(req, res) {
    const messages = await db.getAllMessages();
    res.render("index", { user: req.user, messages: messages });
}

async function logInGet(req, res) {
    res.render("log-in");
}

async function logInPost(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect("/log-in");
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect("/");
        });
    })(req, res, next);
}


async function logOutGet(req, res) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}

async function signUpGet(req, res) {
    res.render("sign-up-form");
}

async function signUpPost(req, res, next) {
    try {
        // Hash the user's password
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) {
                console.error("Error hashing password:", err);
                return next(err);
            }

            const userId = await db.insertUser(req.body.fullName, req.body.username, hashedPassword);

            const newUser = {
                id: userId,
                username: req.body.username,
                fullName: req.body.fullName,
            };

            req.logIn(newUser, (err) => {
                if (err) {
                    console.error("Error logging in after sign up:", err);
                    return next(err);
                }
                return res.redirect("/");
            });
        });
    } catch (err) {
        console.error("Error signing up user:", err);
        return next(err);
    }
}

async function createMessageGet(req, res) {
    res.render("create-message", { user: req.user });
}

async function createMessagePost(req, res, next) {
    try {
        if (!req.user) {
            return res.status(403).send("You must be logged in to create a message.");
        }

        const userId = req.user.id;
        const title= req.body.title;
        const text = req.body.message;

        if (!text || text.trim() === "") {
            return res.status(400).send("Message content cannot be empty.");
        }

        const messageId = await db.insertMessage(userId, title, text);

        res.redirect("/");
    } catch (err) {
        console.error("Error creating message:", err);
        next(err);
    }
}

module.exports = {
    getMessages,
    logInGet,
    logInPost,
    logOutGet,
    signUpGet,
    signUpPost,
    createMessageGet,
    createMessagePost,
};
