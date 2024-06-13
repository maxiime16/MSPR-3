const UserModel = require("../models/userModel");
const { userSchema, loginSchema } = require("../schemas/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Fonction utilitaire pour formater les données utilisateur
const formatUserData = (user) => ({
  type: "user",
  id: user.id,
  attributes: {
    first_name: user.firstname,
    last_name: user.lastname,
    email: user.email,
  },
});

exports.getAll = async (req, res) => {
  try {
    const users = await UserModel.getAll();
    const responseData = users.map(formatUserData);
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await UserModel.getByEmail(email);
    if (!user) {
      return res.status(404).json({ errors: [{ title: "User not found." }] });
    }
    res.status(200).json({ data: formatUserData(user) });
  } catch (error) {
    console.error("Error getting user by email:", error);
    res.status(500).json({ errors: [{ title: "Server Error" }] });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.getById(id);
    if (!user) {
      return res.status(404).json({ errors: [{ title: "User not found." }] });
    }
    res.status(200).json({ data: formatUserData(user) });
  } catch (error) {
    console.error("Error getting user by ID:", error);
    res.status(500).json({ errors: [{ title: "Server Error" }] });
  }
};

exports.createUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  const { error } = userSchema.validate({
    first_name,
    last_name,
    email,
    password,
  });
  if (error) {
    return res
      .status(400)
      .json({ errors: [{ title: error.details[0].message }] });
  }

  try {
    const existingUser = await UserModel.getByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ errors: [{ title: "User with this email already exists." }] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.createUser({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ data: { message: "Utilisateur créé avec succès." } });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ errors: [{ title: "Server Error" }] });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  try {
    const existingUser = await UserModel.getById(id);
    if (!existingUser) {
      return res.status(404).json({ errors: [{ title: "User not found." }] });
    }

    const updatedUser = await UserModel.update(id, userData);
    res.status(200).json({ data: formatUserData(updatedUser) });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ errors: [{ title: "Server Error" }] });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await UserModel.delete(id);
    res.status(200).json({ data: { message: "User deleted successfully." } });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ errors: [{ title: "Server Error" }] });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate({ email, password });
  if (error) {
    return res
      .status(400)
      .json({ errors: [{ title: error.details[0].message }] });
  }

  try {
    const user = await UserModel.getByEmail(email);

    if (!user) {
      return res
        .status(401)
        .json({ errors: [{ title: "Invalid email or password." }] });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ errors: [{ title: "Invalid email or password." }] });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      data: {
        id: user.id,
        type: "user",
        attributes: {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          token: token,
        },
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ errors: [{ title: "Server Error" }] });
  }
};
