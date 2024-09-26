import mongoose from "../db/conn.js";
import membershipTypeSchema from "../models/membershipTypemodel.js";
import { mongoose as mongo } from "mongoose";

//function to validate if a string is a valid MongoDB ObjectId or not
const isValidObjectId = (id) => {
  return mongo.Types.ObjectId.isValid(id);
};

export const membershipTypeModel = mongoose.model(
  "membershipType",
  membershipTypeSchema
);

// create membership type
export async function createMembership(req, res) {
  const { name, price, description } = req.body;

  let membershipType = new membershipTypeModel();

  membershipType.name = name;
  membershipType.price = price;
  membershipType.description = description;

  try {
    // Check if membership type already exists
    const existingMembershipTypeModel = await membershipTypeModel.findOne({
      name: req.body.name,
    });

    if (existingMembershipTypeModel) {
      return res.status(400).json({
        error: "Membership Type already exists",
      });
    } else {
      // No existing membership type with the same name, proceed to save
      await membershipType.save();
      res.send(membershipType);
    }
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

export function viewMembership(req, res) {
  console.log("sddsavsd");
  membershipTypeModel
    .find(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.error(err); // Use console.error for error logging
      res.status(500).json({ message: "something wrong" });
    });
}

export function viewMembershipUsingId(req, res) {
  const id = req.params.id;
  // Validate the ID: ensure it's either a string or a valid ObjectId
  if (!id || typeof id !== "string" || !isValidObjectId(id)) {
    return res.status(403).json({
      message: "Invalid or missing user ID! Please provide a valid ID.",
    });
  }
  membershipTypeModel
    .findById(id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Something went wrong" });
    });
}

export function updateMembershipInfo(req, res) {
  const { name, price, description } = req.body;
  const id = req.params.id;

  // Validate the ID: ensure it's either a string or a valid ObjectId
  if (!id || typeof id !== "string" || !isValidObjectId(id)) {
    return res.status(403).json({
      message: "Invalid or missing user ID! Please provide a valid ID.",
    });
  }

  membershipTypeModel
    .updateOne(
      { _id: id },
      {
        $set: {
          name: name,
          price: price,
          description: description,
        },
      }
    )
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    });
}

export function deleteMembership(req, res) {
  try {
    const id = req.params.id;

    // Validate the ID: ensure it's either a string or a valid ObjectId
    if (!id || typeof id !== "string" || !isValidObjectId(id)) {
      return res.status(403).json({
        message: "Invalid or missing user ID! Please provide a valid ID.",
      });
    }

    membershipTypeModel
      .deleteOne({ _id: id })
      .then((result) => {
        if (result.deletedCount === 0) {
          res.status(404).json({ message: "Membership not found" });
        } else {
          res.send(result);
        }
      })
      .catch((err) => {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "Something went wrong" });
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong while deleting membership" });
  }
}
