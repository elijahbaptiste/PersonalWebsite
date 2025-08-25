const nodemailer = require("nodemailer");
const express = require("express");
const dotenv = require("dotenv");
const Path = require("path");
const app = express();
dotenv.config({ path: "./enviromentvariables/.env" });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(Path.join(__dirname)));
app.use("/styles", express.static(Path.join(__dirname, "../styles")));
app.use("/photos", express.static(Path.join(__dirname, "../photos")));
app.set("views", Path.join(__dirname, "../views"));

//Boilerplate nodemailer code sourced from : https://mailtrap.io/blog/nodemailer-gmail/
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use false for STARTTLS; true for SSL on port 465
  auth: {
    user: process.env.GMAIL_User,
    pass: process.env.GMAIL_Password,
  },
  tls: {
    rejectUnauthorized: false, // 👈 THIS bypasses the SSL certificate check
  },
});

//Routes for internal links and pages
app.get("/", async (req, res) => {
  res.render("mainpage");
});
app.get("/aboutme", async (req, res) => {
  res.render("aboutme");
});
app.get("/contact", async (req, res) => {
  res.render("contact");
});
app.get("/projects", async (req, res) => {
  res.render("projects");
});

app.get("/thanks", async (req, res) => {
  res.render("thanks");
});

//Redirect routes for external links
app.get("/project1", async (req, res) => {
  res.redirect("https://github.com/elijahbaptiste/FocusRoom");
});

app.get("/project2", async (req, res) => {
  res.redirect("https://github.com/elijahbaptiste/TinyGate-Url-Shortener");
});

app.get("/project3", async (req, res) => {
  res.redirect("https://zachshirikjian.itch.io/rush-of-gold");
});

app.get("/linkedin", async (req, res) => {
  res.redirect("https://www.linkedin.com/in/elijah-baptiste/");
});

app.get("/github", async (req, res) => {
  res.redirect("https://github.com/elijahbaptiste");
});

app.get("/email", async (req, res) => {
  res.redirect("mailto:elijahbaptiste79@gmail.com");
});

//Route for health check. Keeps the app awake on free hosting services and prevents cold starts
app.get("/health", async (req, res) => {
  res.status(200).send("OK");
});

app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  const emailBody =
    "You have received a new message from your website contact form.\n\n" +
    "Here are the details:\n" +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Message:\n${message}\n`;

  const mailOptions = {
    from: process.env.GMAIL_User,
    to: process.env.GMAIL_Recipient,
    subject: "New Contact Form Submission",
    text: emailBody,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });

  res.redirect("/thanks");
});

app.listen(process.env.PORT || 3000);
