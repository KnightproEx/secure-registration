const bodyParser = require("body-parser");
const express = require("express");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const siteverifyUrl = "https://www.google.com/recaptcha/api/siteverify";
const secret = "6Lf9L50fAAAAAFBkJUpUF268PGf-H7W_ZGlFl5bV";
const emailRegex =
  /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
const usernameRegex = /^[\w ,.'-]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>\[\]\\\/])\S{12,30}$/;

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(bodyParser.json({ extended: true }));

    server.post("/api/sign-up", async (req, res) => {
      const email = req.body?.email;
      const username = req.body?.username;
      const password = req.body?.password;
      const token = req.body?.token;
      const response = await fetch(
        `${siteverifyUrl}?secret=${secret}&response=${token}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      const captchaVerified = data.success;
      const emailVerified = emailRegex.test(email);
      const usernameVerified = usernameRegex.test(username);
      const passwordVerified = passwordRegex.test(password);
      const success =
        captchaVerified &&
        emailVerified &&
        usernameVerified &&
        passwordVerified;
      res.send({
        success: success,
        error: success
          ? ""
          : captchaVerified
          ? "Captcha error!"
          : "Invalid input format!",
      });
    });

    server.all("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (e) => {
      if (e) throw e;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch((e) => {
    console.error(e.stack);
    process.exit(1);
  });
