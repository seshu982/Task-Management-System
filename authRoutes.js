const express =
  require("express");

const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

const User =
  require("../models/User");

const router =
  express.Router();


// REGISTER

router.post(
  "/register",
  async (req, res) => {

    try {

      const {
        name,
        email,
        password
      } = req.body;

      const existingUser =
        await User.findOne({
          email
        });

      if (existingUser) {

        return res.json({
          message:
            "User Already Exists"
        });

      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      await User.create({

        name,
        email,

        password:
          hashedPassword

      });

      res.json({
        message:
          "Registration Successful"
      });

    } catch (error) {

      console.log(error);

      res.json({
        message:
          "Register Failed"
      });

    }

  }
);


// LOGIN

router.post(
  "/login",
  async (req, res) => {

    try {

      const {
        email,
        password
      } = req.body;

      const user =
        await User.findOne({
          email
        });

      if (!user) {

        return res.json({
          message:
            "User Not Found"
        });

      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res.json({
          message:
            "Wrong Password"
        });

      }

      const token =
        jwt.sign(

          {
            id: user._id
          },

          "secretkey"

        );

      res.json({

        token,

        message:
          "Login Successful"

      });

    } catch (error) {

      console.log(error);

      res.json({
        message:
          "Login Failed"
      });

    }

  }
);

module.exports = router;