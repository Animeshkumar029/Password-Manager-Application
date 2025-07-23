import dotenv from "dotenv";


dotenv.config();

const config={
    PORT: process.env.PORT,
    MONGO_URL:process.env.MONGO_URL,
    JWT_SECRET_KEY:process.env.JWT_SECRET_KEY,
    JWT_EXPIRY:process.env.JWT_EXPIRY,
    BCRYPT_SALT_ROUNDS:process.env.BCRYPT_SALT_ROUNDS,
    VAULT_SECRET: process.env.VAULT_SECRET
}

export default config;