const { Client } = require('pg')

const client = new Client({
  host: "",
  user: "",
  port: 0,
  password: "",
  database: ""
})

module.exports = client
