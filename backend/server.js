require("dotenv").config({ path: __dirname + "/.env" }); // ✅ FORCE PATH

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

pool.connect()
  .then(() => {
    console.log("PostgreSQL connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });