const { Schema, model, Types } = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new Schema(
  {
    email: String,
    password: String,
    firstName: String,
    lastName: String,
  },
  {
    collection: "user",
  }
)

userSchema.methods = {
  hashPassword: async function (password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
  },

  comparePassword: async function (password) {
    return await bcrypt.compare(password, this.password)
  },
}

module.exports = model("user", userSchema)
