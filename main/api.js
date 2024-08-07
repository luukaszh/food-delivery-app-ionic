const client = require('./connection.js');
const express = require('express');
const app = express();
const cors = require(`cors`);
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(3300, () => {
  console.log("Sever is now listening at port 3300");
})

client.connect();

let token;

app.get('/food', (req, res) => {
  client.query(`Select * from food`, (err, result) => {
    if (!err) {
      res.send(result.rows
      );
    } else {
      console.log(err, 'error')
    }
  });
  client.end;
})

app.get('/orders', (req, res) => {
  client.query(`Select * from orders`, (err, result) => {
    if (!err) {
      res.send(result.rows
      );
    } else {
      console.log(err, 'error')
    }
  });
  client.end;
})

app.get('/food/:id', (req, res) => {
  client.query(`Select * from food where id=${req.params.id}`, (err, result) => {
    if (!err) {
      res.send(result.rows[0]);
    }
  });
  client.end;
})

app.delete('/food/:id', (req, res) => {
  jwt.verify(token.token, 'secretKey', (err, authData) => {
    if (err && token.isadmin === false) {
      res.status(403).json({ message: "You do not have permission!" });
    } else {
      let insertQuery = `DELETE FROM food WHERE id=${req.params.id}`;
      client.query(insertQuery, (err, result) => {
        if (!err) {
          res.status(200).json({ message: 'Deletion was successful' });
        } else {
          console.error(err.message);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
      client.end;
    }
  });
});

app.put('/food/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, cooktime, imageurl, description } = req.body;

  jwt.verify(token.token, 'secretKey', (err, authData) => {
    if (err && token.isadmin === false) {
      res.status(403).json({ message: "You do not have permission!" });
    } else {
      const updateQuery = `
        UPDATE food 
        SET name='${name}', price=${price}, cooktime='${cooktime}', imageurl='${imageurl}', description='${description}' 
        WHERE id=${id}
      `;

      client.query(updateQuery, (err, result) => {
        if (!err) {
          res.status(200).json({ message: 'Update was successful' });
        } else {
          console.error(err.message);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
    }
  });
});

app.get('/users', (req, res) => {
  client.query(`Select * from users`, (err, result) => {
    if (!err) {
      res.send(result.rows
      );
    } else {
      console.log(err, 'error')
    }
  });
  client.end;
})

app.post('/users/login', (req, res) => {
  client.query(`Select * from users`, (err, result) => {
    if (!err) {
      const users = result.rows;

      const { email, password } = req.body;
      const user = users.find(user => user.email === email && user.password === password)

      if (user) {
        console.log('git', user)
        token = generateToken(user)
        res.send(token);
      } else {
        res.status(400).send("Password or email incorrect")
      }
    } else {
      res.send(err, 'Users not found')
    }
  })
})

app.post('/users/register', (req, res) => {
  const { name, email, password, isadmin } = req.body;

  client.query(`SELECT * FROM users WHERE email = $1`, [email], (err, result) => {
    if (err) {
      console.error('Error querying users:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    const existingUser = result.rows[0];

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const insertQuery = `INSERT INTO users (name, email, password, isadmin) VALUES ($1, $2, $3, $4)`;
    const values = [name, email, password, isadmin || false];

    client.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      console.log('User successfully registered:', name);
      res.status(200).json({ message: 'User registered successfully' }); 
    });
  });
});

app.get('/examplefood', (req, res) => {
  jwt.verify(token.token, 'secretKey', (err, authData) => {
    if (err && token.isadmin === false) {
      res.sendStatus(403);
    } else {
      client.query(`Select * from examplefood`, (err, result) => {
        if (!err) {
          res.send(result.rows);
        } else {
          res.send(err, 'error')
        }
      });
      client.end;
    }
  });
})

app.post('/food/add', (req, res) => {
  jwt.verify(token.token, 'secretKey', (err, authData) => {
    if (err){
      res.status(403).send("You do not have permission!")
    } else{
      const food = req.body;

      client.query(`SELECT id FROM food ORDER BY id`, (err, result) => {
        if (err) {
          console.log('Error:', err);
          return res.status(500).json({ error: err.message });
        }

        const existingIds = result.rows.map(row => +row.id);
        let nextId = 1;

        while (existingIds.includes(nextId)) {
          nextId++;
        }

        const insertQuery = `INSERT INTO food(id, name, price, cooktime, imageurl, description)
        VALUES('${nextId}', '${food.name}', '${food.price}', '${food.cooktime}', '${food.imageurl}', '${food.description}')`;


        client.query(insertQuery, (err, result) => {
          if (err) {
            console.log('Error:', err);
            return res.status(500).json({ error: 'Insertion was NOT successful: ' + err.message });
          }

          res.status(200).json({ message: 'Insertion was successful' });
        });
      });
    }
  });
});

app.post('/orders', (req, res) => {
  
  jwt.verify(token.token, 'secretKey', (err, authData) => {
  if (err){
    res.status(403).send("You do not have permission!")
  } else{
  client.query(`SELECT id FROM orders ORDER BY id`, (err, result) => {
    if (err) {
      console.log('Error:', err);
      return res.status(500).json({ error: err.message });
    }
    const existingIds = result.rows.map(row => +row.id);
    let nextId = 1;

    while (existingIds.includes(nextId)) {
      nextId++;
    }
    const orders_len = result.rows.length;
    const formatItems = JSON.stringify(req.body.items);
    const order = req.body;

    const insertQuery = `INSERT INTO orders(id, name, items, totalprice, address)
      VALUES('${nextId}', '${order.name}', '${formatItems}', '${order.totalprice}', '${order.address}')`;

    client.query(insertQuery, (err, result) => {
      if (err) {
        console.log('Error:', err);
        return res.status(500).json({ error: 'Insertion was NOT successful: ' + err.message });
      }

      res.status(200).json({ message: 'Insertion was successful' });
    });
  });
  }
  });
});




const generateToken = (user) => {
  const token = jwt.sign({
    email: user.email, isadmin: user.isadmin
  }, "secretKey", {
    expiresIn: "30d"
  });
  user.token = token;
  console.log(token)
  return user;
}

function dynamicSort(property) {
  return function (a, b) {
    return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
  }
}
