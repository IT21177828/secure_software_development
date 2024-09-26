import CheckOutModel from "../models/checkoutModel.js";
import crypto from "crypto";
import logger from "../logger/logger.js";

const getcheckout = (req, res) => {
  CheckOutModel.find()
    .then(
      (checkout) => res.json(checkout),
      logger.info("checkout data fetched successfully")
    )
    .catch(
      (err) => res.json(err),
      logger.error("Error in fetching checkout data")
    );
};


const createCheckout = async (req, res) => {
  try {
    // Extract data from the request body
    const { name, email, address, cardNumber, expirationDate, cvv } = req.body;

    // Validate the email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logger.error("Invalid email address");
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Validate the cardNumber (assuming it's a numeric string with a specific length)
    const cardNumberRegex = /^[0-9]{16}$/;
    if (!cardNumberRegex.test(cardNumber)) {
      logger.error("Invalid card number");
      return res.status(400).json({ error: "Invalid card number" });
    }

    // Validate the CVV (assuming it's a 3 or 4-digit numeric string)
    const cvvRegex = /^[0-9]{3,4}$/;
    if (!cvvRegex.test(cvv)) {
      logger.error("Invalid CVV");

      return res.status(400).json({ error: "Invalid CVV" });
    }

    // Validate the expirationDate (assuming it's in the format 'MM/YY')
    const expirationDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expirationDateRegex.test(expirationDate)) {
      logger.error("Invalid expiration date");
      return res.status(400).json({ error: "Invalid expiration date" });
    }

    const encryptionKey =
      "327322ba9a4e8d02b90a07eb0d39aa166a687259f4fe37809d8dad254293c805"; // Replace with your secret key
    const iv = crypto.randomBytes(16); // Use a 16-byte IV for AES-256-CBC

    // Create an AES cipher for cardNumber and CVV
    const cardNumberCipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(encryptionKey, "hex"),
      iv
    );
    const cvvCipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(encryptionKey, "hex"),
      iv
    );

    // Encrypt cardNumber and CVV
    let encryptedCardNumber = cardNumberCipher.update(
      cardNumber,
      "utf-8",
      "hex"
    );
    encryptedCardNumber += cardNumberCipher.final("hex");

    let encryptedCVV = cvvCipher.update(cvv, "utf-8", "hex");
    encryptedCVV += cvvCipher.final("hex");

    // Create a new checkout document and save it to the database
    const checkout = new CheckOutModel({
      name,
      email,
      address,
      cardNumber: encryptedCardNumber,
      expirationDate,
      cvv: encryptedCVV,
    });

    const savedCheckout = await checkout.save();
    res.json(savedCheckout);
    logger.info("Checkout data stored");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while storing the checkout." });
    logger.error("Error in storing checkout data");
  }
};

export default { createCheckout, getcheckout };
