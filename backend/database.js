const Pool = require("pg").Pool;

const pool = new Pool({
  host: "localhost",
  user: "evanarimitsu",
  port: 5432,
  database: "postgres",
});

module.exports = pool;
