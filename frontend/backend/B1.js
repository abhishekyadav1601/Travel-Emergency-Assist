// B1.js

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// temporary database
let emergencyData = [];


// home
app.get("/", (req, res) => {
    res.send("Backend running 🚀");
});


// save emergency
app.post("/emergency", (req, res) => {

    const {
        type,
        latitude,
        longitude
    } = req.body;


    // validation
    if (
        !type ||
        latitude === undefined ||
        longitude === undefined
    ) {
        return res.status(400).json({
            message: "All fields required!"
        });
    }


    const data = {

        id: Date.now(),

        type,

        latitude,

        longitude,

        time: new Date().toISOString()

    };


    emergencyData.push(data);

    console.log("✅ Saved:", data);


    res.status(201).json({

        message:
            "Emergency saved successfully 🚨",

        data

    });

});


// get history
app.get("/history", (req, res) => {

    const sorted =
        [...emergencyData].sort(

            (a, b) =>
                new Date(b.time) -
                new Date(a.time)

        );

    res.json(sorted);

});


// delete
app.delete("/emergency/:id", (req, res) => {

    const id =
        parseInt(req.params.id);

    emergencyData =
        emergencyData.filter(

            item => item.id !== id

        );

    res.json({
        message:
            "Deleted successfully"
    });

});


// server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});