import mongoose from "../db/conn.js";
import membership from "../models/membershipModel.js";
import membershipTypeSchema from "../models/membershipTypemodel.js";
import user from "../models/usermodel.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { mongoose as mongo } from "mongoose";

export const membershipTypeModel = mongoose.model(
  "membershipType",
  membershipTypeSchema
);
export const membershipModell = mongoose.model("membership", membership);
export const userModel = mongoose.model("user", user);

//function to validate if a string is a valid MongoDB ObjectId or not
const isValidObjectId = (id) => {
  return mongo.Types.ObjectId.isValid(id);
};

const transporter = nodemailer.createTransport({
  service: "Gmail", // Use the appropriate email service
  auth: {
    user: "keshanfrnnd@gmail.com", // Replace with your email address
    pass: "tfmy umpk gegq psrv", // Replace with your email password or an app-specific password
  },
});

//acivate new membership
export async function activateMembership(req, res) {
  const { email, name, payment, status } = req.body;

  let membershipTyp = new membershipTypeModel();
  let user = new userModel();

  membershipTyp.name = name;
  user.email = email;
  membershipTyp.payment = payment;
  console.log("mmmmmmm");
  // membershipTyp.startDate = new Date.now();
  // membershipTyp.endDate.setDate(membershipTyp.startDate.getDate() +membershipTyp.membershipType.duration);

  try {
    // Check if membership type already exists
    const existingMembershipTypeModel = await membershipTypeModel.findOne({
      name: req.body.name,
    });

    console.log("fdsvsdfvsdfvsdvsf");
    console.log(email);
    const mailOptions = {
      from: "keshanfrnnd@gmail.com", // Replace with your email address
      to: email, // Replace with the recipient's email address
      subject: "Hello from Nodemailer",
      text: "This is a test email sent from Nodemailer.",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    if (status != "active") {
      if (payment == "approved") {
        if (existingMembershipTypeModel) {
          try {
            let membershipModel = new membershipModell();

            // membershipModel.user = userObject.firstName;
            membershipModel.membershipType = existingMembershipTypeModel._id;
            membershipModel.startDate = new Date();
            membershipModel.endDate = new Date();
            membershipModel.endDate.setDate(
              membershipModel.endDate.getDate() +
                existingMembershipTypeModel.duration
            );
            membershipModel.status = "active";
            membershipModel.email = email;
            membershipModel.name = name;

            await membershipModel.save();

            const mailOptions = {
              from: "keshanfrnnd@gmail.com", // Replace with your email address
              to: newUser.email, // Replace with the recipient's email address
              subject: "Hello from Nodemailer",
              text: "This is a test email sent from Nodemailer.",
            };

            res.send(membershipModel);
          } catch (err) {
            console.log(err);
            res.status(500).json({ err });
          }
        } else {
          return res.status(400).json({
            error: "Membership Type does not exist",
          });
        }
      } else {
        return res.status(400).json({
          error: "Payment not approved",
        });
      }
    } else {
      console.log("already active");
      return res.status(400).json({
        error: "Membership already active",
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

//deactivate membership
export async function deactivateMemberShip(req, res) {
  const { id } = req.params;

  // Validate the ID: ensure it's either a string or a valid ObjectId
  if (!id || typeof id !== "string" || !isValidObjectId(id)) {
    return res.status(403).json({
      message: "Invalid or missing user ID! Please provide a valid ID.",
    });
  }

  try {
    const membershipModel = await membershipModell.findOne({ _id: id });

    if (membershipModel) {
      membershipModel.status = "inactive";
      await membershipModel.save();
      res.send(membershipModel);
    } else {
      res.status(400).json({ error: "Membership does not exist" });
    }
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

// reactivate membership after deactivation
export async function reactivateMembership(req, res) {
  try {
    const { id } = req.params;

    // Validate the ID: ensure it's either a string or a valid ObjectId
    if (!id || typeof id !== "string" || !isValidObjectId(id)) {
      return res.status(403).json({
        message: "Invalid or missing user ID! Please provide a valid ID.",
      });
    }

    const membershipModel = await membershipModell.findOne({ _id: id });

    if (membershipModel) {
      membershipModel.status = "active";
      await membershipModel.save();
      res.send(membershipModel);
    } else {
      res.status(400).json({ error: "Membership does not exist" });
    }
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

export async function getMembershipActivationDetails(req, res) {
  try {
    const { email } = req.body;

    // Validate the ID: ensure it's either a string or a valid ObjectId
    if (!email || typeof email !== "string") {
      return res.status(403).json({
        message: "Invalid or missing user Email! Please provide a valid Email.",
      });
    }

    await membershipModell
      .findOne({ email: email })
      .then((data) => {
        console.log(data);
        res.send(data);
        // if(membershipModel){
        //     res.send(membershipModel);
        // }else{
        //     res.status(400).json({ error: "Membership does not exist" });
        // }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Some error occurred while retrieving membership.",
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Some error occurred while retrieving membership.",
    });
  }
}
