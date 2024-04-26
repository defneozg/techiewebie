const express = require("express");
const Users = require("./entites/users.js");
const Discussion = require('./entites/discussions');
const session = require('express-session');
const Login = require("./entites/login.js");
//const session = require('express-session');

function init(db) {
    const router = express.Router();

    router.use(express.json());
    // simple logger for this router's requests
    // all requests to this router will first hit this middleware
    router.use((req, res, next) => {
        console.log('API: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
    });

    router.get('', async (req, res) => {
        const locals = {
            title: "techie-webie",
            description: "projet de techno web yippie"
        }

        try {
        const data = await Discussion.find();
        res.render('./client/MainPage', { locals, data });
        } catch (error) {
            console.log(error);
        }
    });

    const users = new Users.default(db); // new Users ??
    router.post("/user/login", async (req, res) => {
        try {
            const { login, password } = req.body;
            // Erreur sur la requête HTTP
            if (!login || !password) {
                res.status(400).json({
                    status: 400,
                    "message": "Requête invalide : login et password nécessaires"
                });
                return;
            }
            if(! await users.exists(login)) {
                res.status(401).json({
                    status: 401,
                    message: "Utilisateur inconnu"
                });
                return;
            }
            let userid = await users.checkpassword(login, password);
            if (userid) {
                // Avec middleware express-session
                req.session.regenerate(function (err) {
                    if (err) {
                        res.status(500).json({
                            status: 500,
                            message: "Erreur interne"
                        });
                    }
                    else {
                        // C'est bon, nouvelle session créée
                        req.session.userid = userid;
                        res.status(200).json({
                            status: 200,
                            message: "Login et mot de passe accepté"
                        });
                    }
                });
                return;
            }
            // Faux login : destruction de la session et erreur
            req.session.destroy((err) => { });
            res.status(403).json({
                status: 403,
                message: "login et/ou le mot de passe invalide(s)"
            });
            return;
        }
        catch (e) {
            // Toute autre erreur
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
    });

    router
        .route("/user/:user_id(\\d+)")
        .get(async (req, res) => {
            try {
                const user = await users.get(req.params.user_id);
                if (!user)
                    res.sendStatus(404);
                else
                    res.send(user);
            }
            catch (e) {
                res.status(500).send(e);
            }
        })
        .delete((req, res, next) => res.send(`delete user ${req.params.user_id}`));

    router.post("/user/register", (req, res) => {
        console.log("hey3");
        const { username, password, firstName, lastName } = req.body;
        console.log(req.body)
        console.log(username, password, firstName, lastName);
        if (!username || !password || !lastName || !firstName) {
            console.log("hey5");
            res.status(400).send("Missing fields");
        } else {
            console.log("hey6");
            users.createUser(username, password, firstName, lastName)
                .then((user_id) => res.status(201).send({ id: user_id }))
                .catch((err) => res.status(500).send(err));
        }
    });

    return router;
}

exports.default = init;