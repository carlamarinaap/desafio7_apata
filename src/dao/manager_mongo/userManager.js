import UserSchema from "../models/user.schema.js";

class UserManager {
  addUser = async (user) => {
    try {
      await UserSchema.insertMany(user);
      return user;
    } catch (error) {
      throw new Error(`Error al agregar producto: ${error.message}`);
    }
  };

  getUser = async (email) => {
    return await UserSchema.findOne({ email });
  };

  getUserByCreds = async (email, password) => {
    return await UserSchema.findOne({ email, password });
  };
}

export default UserManager;
