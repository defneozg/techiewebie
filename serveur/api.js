const express = require("express");
const Users = require("./entites/users.js");
const Discussion = require('./entites/discussions');
const Message = require("./entites/messages.js");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

function init(db) {
    const router = express.Router();

    const store = new MongoDBStore({
        uri: 'mongodb://localhost:27017/techie_webie_db',
        collection: 'sessions' // Changed collection name to 'sessions'
    });

    store.on('error', function(error) {
        console.error('Session store error:', error);
    });

    // Create an instance of Users class
    const users = new Users.default(db);

    // Middleware for session management
    router.use(session({
        secret: 'i_luv_techie_webie', // Ensure this secret is kept secure
        resave: false,
        saveUninitialized: true,
        store : store
    }));

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
            console.log("Creating discussion:", discussion);
            const newDiscussion = await Discussion.insertDiscussion(discussion);
            res.status(201).json(newDiscussion);
        } catch (error) {
            console.error('Error creating discussion:', error);
            res.status(500).json({ message: 'Error creating discussion' });
        }
    });

    // GET discussions
    router.get('/discussions', async (req, res) => {
        try {
            const discussions = await Discussion.getAllDiscussions();
            res.status(200).json(discussions);
        } catch (error) {
            console.error('Error fetching discussions:', error);
            res.status(500).json({ message: 'Error fetching discussions' });
        }
    });

    // POST discussions - Admin Only
    router.post('/discussions', async (req, res) => {
        try {
            // Check if the user is an admin
            if (!req.session || !req.session.userid || !await users.isAdmin(req.session.userid)) {
                res.status(403).json({ error: 'Unauthorized' });
                return;
            }

            const discussion = req.body;
            console.log("Creating discussion:", discussion);
            const newDiscussion = await Discussion.insertDiscussion(discussion);
            res.status(201).json(newDiscussion);
        } catch (error) {
            console.error('Error creating discussion:', error);
            res.status(500).json({ message: 'Error creating discussion' });
        }
    });

    // GET messages
    router.get('/messages', async (req, res) => {
        const { discussionId } = req.query;
        try {
            const messages = await Message.getAllMessagesByDiscussionId(discussionId);
            res.json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // POST messages
    router.post('/messages', async (req, res) => {
        const { discussionId, msg } = req.body;
        try {
            const newMessage = await Message.insertMessage({ discussionId, msg });
            res.status(201).json(newMessage);
        } catch (error) {
            console.error('Error creating message:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // GET discussion by its id
    router.get('/discussions/:discussionId', async (req, res) => {
        const { discussionId } = req.params;
        try {
            const discussion = await Discussion.findDiscussionById(discussionId);
            if (!discussion) {
                res.status(404).json({ error: 'Discussion not found' });
                return;
            }
            res.json(discussion);
        } catch (error) {
            console.error('Error fetching discussion:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    
    // POST login
    router.post("/user/login", async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                res.status(400).json({
                    status: 400,
                    "message": "Invalid request: login and password are required"
                });
                return;
            }
            if (!await users.exists(username)) {
                res.status(401).json({
                    status: 401,
                    message: "Unknown user"
                });
                return;
            }
            let userId = await users.checkpassword(username, password);
            if (userId) {
                req.session.regenerate(function (err) {
                    if (err) {
                        res.status(500).json({
                            status: 500,
                            message: "Internal error"
                        });
                    }
                    else {
                        req.session.userid = userId;
                        console.log(req.session.userid);    
                        res.status(200).json({
                            status: 200,
                            message: "Login and password accepted"
                        });
                    }
                });
                return;
            }
            req.session.destroy((err) => { });
            res.status(403).json({
                status: 403,
                message: "Invalid login and/or password"
            });
            return;
        }
        catch (e) {
            res.status(500).json({
                status: 500,
                message: "Internal error",
                details: (e || "Unknown error").toString()
            });
        }
    });

    // GET administrator status
    router.get('/user/admin', async (req, res) => {
        try {
            console.log(req.session.userid);
            if (!req.session || !req.session.userid) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const isAdmin = await users.isAdmin(req.session.userid);
            res.json({ isAdmin });
        } catch (error) {
            console.error('Error checking admin status:', error);
            res.status(500).json({ error: 'Internal server error' });
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

    
    // POST SignUp
    router.post("/user/register", (req, res) => {
        const { username, password, firstName, lastName, isAdmin } = req.body;
        if (!username || !password || !lastName || !firstName) {
            res.status(400).send("Missing fields");
        } else {
            users.createUser(username, password, firstName, lastName, isAdmin)
                .then((user_id) => res.status(201).send({ id: user_id }))
                .catch((err) => res.status(500).send(err));
        }
    });

    return router;
}

exports.default = init;
