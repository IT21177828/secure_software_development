import mongoose from "../db/conn.js";
import membership from "../models/membershipModel.js";
import membershipTypeSchema from "../models/membershipTypemodel.js";
import user from "../models/usermodel.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import logger from "../logger/logger.js";
export const membershipTypeModel = mongoose.model(
  "membershipType",
  membershipTypeSchema
);
export const membershipModell = mongoose.model("membership", membership);
export const userModel = mongoose.model("user", user);

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
        logger.error("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        logger.info("Email sent");
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
            logger.info("Membership created successfully");
          } catch (err) {
            console.log(err);
            res.status(500).json({ err });
            logger.error("Error in creating Membership");
          }
        } else {
          logger.error("Membership Type does not exist");
          return res.status(400).json({
            error: "Membership Type does not exist",
          });
        }
      } else {
        logger.error("Payment not approved");
        return res.status(400).json({
          error: "Payment not approved",
        });
      }
    } else {
      console.log("already active");
      logger.error("Membership already active");
      return res.status(400).json({
        error: "Membership already active",
      });
    }
  } catch (err) {
    logger.error("Error in creating Membership");
    res.status(500).json({ error: "Something went wrong" });
  }
}

//deactivate membership
export async function deactivateMemberShip(req, res) {
  const { id } = req.params;

  try {
    const membershipModel = await membershipModell.findOne({ _id: id });

    if (membershipModel) {
      membershipModel.status = "inactive";
      await membershipModel.save();
      res.send(membershipModel);
      logger.info("Membership deactivated successfully");
    } else {
      res.status(400).json({ error: "Membership does not exist" });
      logger.error("Membership does not exist");
    }
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
    logger.error("Error in deactivating Membership");
  }
}

// reactivate membership after deactivation
export async function reactivateMembership(req, res) {
  const { id } = req.params;

  try {
    const membershipModel = await membershipModell.findOne({ _id: id });

    if (membershipModel) {
      membershipModel.status = "active";
      await membershipModel.save();
      res.send(membershipModel);
    } else {
      res.status(400).json({ error: "Membership does not exist" });
      logger.error("Membership does not exist");
    }
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
    logger.error("Error in reactivating Membership");
  }
}

export async function getMembershipActivationDetails(req, res) {
  console.log("aaaaaaaaaa");
  const { email } = req.body;
  console.log(email);
  console.log(req.body);

  try {
    await membershipModell
      .findOne({ email: email })
      .then((data) => {
        console.log(data);
        res.send(data);
        logger.info("Membership activation details fetched successfully");
        // if(membershipModel){
        //     res.send(membershipModel);
        // }else{
        //     res.status(400).json({ error: "Membership does not exist" });
        // }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving membership.",
        });
        logger.error("Error in fetching Membership activation details");
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving membership.",
    });
    logger.error("Error in fetching Membership activation details");
  }
}
