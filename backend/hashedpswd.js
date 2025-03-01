const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Mot de passe haché :", hashedPassword);
}

hashPassword("456"); 