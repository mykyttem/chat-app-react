// dependencies
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin")

// moudule exports
const { logger } = require("./log");
var serviceAccount = require("./serviceAccountKey.json");

// app
const app = express();

app.use(cors());
app.use(express.json());

// Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});  

// auth
try {
    app.post("/sign-up", async (req, res) => {
        // data user
        const { email, password } = req.body;

        const userResponse = await admin.auth().createUser({
            email: email,
            password: password
        })

        res.json(userResponse);
    })
} catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
    logger.error(`error sign up ${e}`);
}


// listen port
const port = 3000;
app.listen(port, () => {
    logger.info(`server is running on port ${port}`)
})