require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGO_URI)
.then(() => {

    console.log("MongoDB Connected");

})
.catch((error) => {

    console.log(error);

});

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low"
    },

    completed: {
        type: Boolean,
        default: false
    }

});

const Task = mongoose.model("Task", taskSchema);

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "index.html"));

});

app.get("/api/tasks", async (req, res) => {

    try {

        const tasks = await Task.find().sort({ _id: -1 });

        res.json(tasks);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

app.post("/api/tasks", async (req, res) => {

    try {

        const task = new Task({

            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            priority: req.body.priority,
            completed: req.body.completed

        });

        await task.save();

        res.status(201).json(task);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

app.patch("/api/tasks/:id", async (req, res) => {

    try {

        const task = await Task.findById(req.params.id);

        if (!task) {

            return res.status(404).json({

                message: "Task not found"

            });

        }

        task.completed = !task.completed;

        await task.save();

        res.json(task);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

app.delete("/api/tasks/:id", async (req, res) => {

    try {

        await Task.findByIdAndDelete(req.params.id);

        res.json({

            message: "Task deleted successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});