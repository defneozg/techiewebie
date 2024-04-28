const express = require("express");
const Users = require("./entites/users.js");
const Discussion = require('./entites/discussions');
const session = require('express-session');

function init(db) {
    const router = express.Router();

    router.use(express.json());
    
    router.use((req, res, next) => {
        console.log('API: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
    });

    // POST discussions
    router.post('/discussions', async (req, res) => {
        try {
          const discussion = req.body; // Assuming the request body contains title and content fields
          console.log("altimdasin lolll");
          console.log(discussion);
          const newDiscussion = await Discussion.insertDiscussion(discussion);
          res.status(201).json(newDiscussion);
        } catch (error) {
          console.error('Error creating discussion:', error);
          res.status(500).json({ message: 'Error creating discussion' });
        }
      });

    // POST login
    const users = new Users.default(db);
    router.use(session({
        secret: 'i_luv_techie_webie',
        resave: false,
        saveUninitialized: true
      }));
    router.post("/user/login", async (req, res) => {
        try {
            const { username, password } = req.body;
            // Erreur sur la requête HTTP
            if (!username || !password) {
                res.status(400).json({
                    status: 400,
                    "message": "Requête invalide : login et password nécessaires"
                });
                return;
            }
            //console.log(await users.exists(username));
            if(! await users.exists(username)) {
                res.status(401).json({
                    status: 401,
                    message: "Utilisateur inconnu"
                });
                return;
            }
            let userid = await users.checkpassword(username, password);
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

    
    //POST SignUp
    router.post("/user/register", (req, res) => {
        const { username, password, firstName, lastName } = req.body;
        console.log(req.body)
        console.log(username, password, firstName, lastName);
        if (!username || !password || !lastName || !firstName) {
            console.log("hey5");
            res.status(400).send("Missing fields");
        } else {
            users.createUser(username, password, firstName, lastName)
                .then((user_id) => res.status(201).send({ id: user_id }))
                .catch((err) => res.status(500).send(err));
        }
    });

    return router;
}

exports.default = init;