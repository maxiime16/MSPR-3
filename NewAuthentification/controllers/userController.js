const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getAll = async (req, res) => {
  try {
    const users = await UserModel.getAll();
    const responseData = users.map((user) => ({
      type: "user",
      id: user.id,
      attributes: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    }));
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
    res.status(200).json({
      data: {
        type: "user",
        id: user.id,
        attributes: {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        },
      },
    });
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
    res.status(200).json({
      data: {
        type: "user",
        id: user.id,
        attributes: {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Error getting user by ID:", error);
    res.status(500).json({ errors: [{ title: "Server Error" }] });
  }
};

exports.createUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await UserModel.getByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ errors: [{ title: "User with this email already exists." }] });
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.createUser({
      first_name,
      last_name,
      email,
      password: hashedPassword, // Utiliser le mot de passe haché
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
    // Vérifier si l'utilisateur existe
    const existingUser = await UserModel.getById(id);
    if (!existingUser) {
      return res.status(404).json({ errors: [{ title: "User not found." }] });
    }

    const updatedUser = await UserModel.update(id, userData);
    res.status(200).json({ data: updatedUser });
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

  try {
    // Recherche de l'utilisateur par email
    const user = await UserModel.getByEmail(email);

    if (!user) {
      return res.status(404).json({ errors: [{ title: "User not found." }] });
    }

    // Vérification du mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ errors: [{ title: "Incorrect password." }] });
    }

    // Si le mot de passe est correct, créer un JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      "test" // Clé secrète pour signer le token
    );

    // Retourner les informations de l'utilisateur et le token JWT
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
