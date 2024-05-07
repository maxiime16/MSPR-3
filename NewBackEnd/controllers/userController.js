const UserModel = require("../models/userModel");

// Méthode pour obtenir un utilisateur par son ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.getById(req.params.id);
    res.status(200).json({
      data: {
        type: "users",
        id: user.id,
        attributes: {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          password: user.password,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// Méthode pour obtenir tous les utilisateurs
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.getAll();
    const responseData = users.map((user) => ({
      type: "users",
      id: user.id,
      attributes: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
      },
    }));
    res.status(200).json({ data: responseData });
  } catch (err) {
    next(err);
  }
};
