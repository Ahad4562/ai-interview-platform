require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const OpenAI = require("openai");

const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const User = require("./models/User");
const Interview =
  require("./models/Interview");

const app = express();

app.use(
  cors({
    origin: "https://ai-interview-platform-five-beta.vercel.app",
    credentials: true,
  })
);
app.use(express.json());


// =========================
// OpenAI Setup
// =========================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// =========================
// Multer Setup
// =========================

const upload = multer({
  dest: "uploads/",
});


// =========================
// MongoDB Connection
// =========================

mongoose.connect(
  "mongodb+srv://2k22cse2213255_db_user:Ahad4562@cluster0.urmscaa.mongodb.net/?appName=Cluster0"
)
.then(() => {
  console.log("MongoDB Connected 🚀");
})
.catch((error) => {
  console.log(error);
});


// =========================
// Signup Route
// =========================

app.post("/signup", async (req, res) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    // Existing User Check
    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message:
          "User Already Exists",
      });

    }

    // Hash Password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create User
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      message:
        "User Registered Successfully 🚀",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

});


// =========================
// Login Route
// =========================

app.post("/login", async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    // Find User
    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message: "User Not Found",
      });

    }

    // Compare Password
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message:
          "Invalid Password",
      });

    }

    // JWT Token
    const token = jwt.sign(
      {
        id: user._id,
      },
      "mySecretKey",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message:
        "Login Successful 🚀",
      token,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

});


// =========================
// Questions API
// =========================

app.get("/questions", (req, res) => {

  const questions = [

    "Tell me about yourself.",

    "What is React?",

    "Explain useEffect Hook.",

    "What is Node.js?",

    "Explain MongoDB.",

    "What is JWT Authentication?",

    "What is REST API?",

    "Explain closures in JavaScript.",

  ];

  res.json({
    questions,
  });

});


// =========================
// AI Question API
// =========================

app.get("/ai", async (req, res) => {

  try {

    const completion =
      await openai.chat.completions.create({

        model: "gpt-3.5-turbo",

        messages: [

          {
            role: "user",
            content:
              "Generate one frontend interview question.",
          },

        ],

      });

    res.json({
      reply:
        completion.choices[0]
          .message.content,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "AI Error",
    });

  }

});


// =========================
// AI Evaluation API
// =========================

app.post("/evaluate", async (req, res) => {

  try {

    const { answer } = req.body;

    const completion =
      await openai.chat.completions.create({

        model: "gpt-3.5-turbo",

        messages: [

          {
            role: "system",
            content:
              "You are an AI interviewer. Evaluate the answer and give score, confidence, communication skills and technical feedback.",
          },

          {
            role: "user",
            content: answer,
          },

        ],

      });

    res.json({
      feedback:
        completion.choices[0]
          .message.content,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Evaluation Error",
    });

  }

});


// =========================
// Resume Analysis API
// =========================

app.post(
  "/resume-analysis",
  upload.single("resume"),
  async (req, res) => {

    try {

      // Read PDF
      const dataBuffer =
        fs.readFileSync(
          req.file.path
        );

      // Extract Text
      const pdfData =
        await pdfParse(dataBuffer);

      const resumeText =
        pdfData.text;

      // OpenAI Analysis
      const completion =
        await openai.chat.completions.create({

          model: "gpt-3.5-turbo",

          messages: [

            {
              role: "system",
              content:
                "You are an AI Resume Analyzer. Analyze the resume and extract skills, projects, subjects and generate interview questions.",
            },

            {
              role: "user",
              content: resumeText,
            },

          ],

        });

      // Delete Uploaded File
      fs.unlinkSync(req.file.path);

      res.json({
        analysis:
          completion.choices[0]
            .message.content,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Resume Analysis Error",
      });

    }

  }
);


// =========================
// Save Interview API
// =========================

app.post(
  "/save-interview",
  async (req, res) => {

    try {

      const {
        userId,
        category,
        score,
        feedback,
        status,
      } = req.body;

      const interview =
        new Interview({

          userId,
          category,
          score,
          feedback,
          status,

        });

      await interview.save();

      res.json({
        message:
          "Interview Saved Successfully 🚀",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Save Interview Error",
      });

    }

  }
);


// =========================
// Dashboard Stats API
// =========================

app.get(
  "/dashboard-stats/:userId",
  async (req, res) => {

    try {

      const { userId } =
        req.params;

      // Total Interviews
      const total =
        await Interview.countDocuments({
          userId,
        });

      // Completed
      const completed =
        await Interview.countDocuments({
          userId,
          status: "Completed",
        });

      // Pending
      const pending =
        await Interview.countDocuments({
          userId,
          status: "Pending",
        });

      res.json({
        total,
        completed,
        pending,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Dashboard Stats Error",
      });

    }

  }
);


// =========================
// Interview History API
// =========================

app.get(
  "/interview-history/:userId",
  async (req, res) => {

    try {

      const { userId } =
        req.params;

      const interviews =
        await Interview.find({
          userId,
        }).sort({
          createdAt: -1,
        });

      res.json(interviews);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Interview History Error",
      });

    }

  }
);


// =========================
// Server Start
// =========================

app.listen(5000, () => {

  console.log(
    "Server running on port 5000 🚀"
  );

});