const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const users = [];
const generateID = () => Math.random().toString(36).substring(2, 10);

app.post("/api/SignUpForm", async (req, res) => {
    const {password, username, firstName, lastName } = req.body;
    const id = generateID();
    //👇🏻 ensures there is no existing user with the same credentials
    const result = users.filter(
        (user) => user.username === username && user.password === password
    );
    //👇🏻 if true
    if (result.length === 0) {
        const newUser = { id, password, username, firstName, lastName };
        //👇🏻 adds the user to the database (array)
        users.push(newUser);
        //👇🏻 returns a success message
        return res.json({
            message: "Account created successfully!",
        });
    }
    //👇🏻 if there is an existing user
    res.json({
        error_message: "User already exists",
    });
});


app.post("/api/LoginPage", (req, res) => {
    const { username, password } = req.body;
    //👇🏻 checks if the user exists
    let result = users.filter(
        (user) => user.username === username && user.password === password
    );
    //👇🏻 if the user doesn't exist
    if (result.length !== 1) {
        return res.json({
            error_message: "Incorrect credentials",
        });
    }
    //👇🏻 Returns the id if successfuly logged in
    res.json({
        message: "Login successfully",
        id: result[0].id,
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});