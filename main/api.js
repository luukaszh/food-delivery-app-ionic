const client = require('./connection.js');
const express = require('express');
const app = express();
const cors = require(`cors`);
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const sendEmail = require('./nodemailer');


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

app.get('/foodids', (req, res) => {
  const ids = req.query.ids;

  if (!ids) {
    return res.status(400).send('Food IDs are required.');
  }

  const idsArray = Array.isArray(ids) ? ids : ids.split(',');

  const query = 'SELECT * FROM food WHERE id = ANY($1::int[])';

  client.query(query, [idsArray], (err, result) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).send('Failed to fetch food data.');
    }

    res.status(200).json(result.rows);
  });
});


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

  client.query(`SELECT id FROM users ORDER BY id`, (err, result) => {
    if (err) {
      console.error('Error querying user IDs:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    const existingIds = result.rows.map(row => +row.id);
    let nextId = 1;
    while (existingIds.includes(nextId)) {
      nextId++;
    }

    console.log('Generated next user ID:', nextId);

    client.query(`SELECT * FROM users WHERE email = $1`, [email], (err, result) => {
      if (err) {
        console.error('Error querying users:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      const existingUser = result.rows[0];
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      const insertQuery = `INSERT INTO users (id, name, email, password, isadmin) VALUES ($1, $2, $3, $4, $5)`;
      const values = [nextId, name, email, password, isadmin || false];

      client.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        console.log('User successfully registered:', name);
        res.status(200).json({ message: 'User registered successfully', userId: nextId });
      });
    });
  });
});

app.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  client.query(`SELECT * FROM users WHERE id = $1`, [userId], (err, result) => {
    if (err) {
      console.error('Error querying user:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    console.log('Fetched user:', user);
    res.status(200).json(user);
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

app.post('/users/register', (req, res) => {
  const { name, email, password, isadmin } = req.body;

  client.query(`SELECT id FROM users ORDER BY id`, (err, result) => {
    if (err) {
      console.error('Error querying user IDs:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    const existingIds = result.rows.map(row => +row.id);
    let nextId = 1;
    while (existingIds.includes(nextId)) {
      nextId++;
    }

    client.query(`SELECT * FROM users WHERE email = $1`, [email], (err, result) => {
      if (err) {
        console.error('Error querying users:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      const existingUser = result.rows[0];

      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
      
      
      const insertQuery = `INSERT INTO users (name, email, password, isadmin, id) VALUES ($1, $2, $3, $4, $5)`;
      const values = [name, email, password, isadmin || false, nextId];

      client.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        console.log('useridd', nextId);
        console.log('User successfully registered:', name);
        res.status(200).json({ message: 'User registered successfully' });
      });
    });
  });
});

app.post('/orders', (req, res) => {
  
  jwt.verify(token.token, 'secretKey', (err, authData) => {
    if (err) {
      return res.status(403).send("You do not have permission!");
    }

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

      const order = req.body;

      const foodIds = order.items.map(item => parseInt(item.food.id, 10));

      const insertQuery = `INSERT INTO orders(id, name, totalprice, address, userid, foodid, status)
        VALUES($1, $2, $3, $4, $5, $6::int[], $7)`;

      const values = [
        nextId,
        order.name,
        order.totalprice,
        order.address,
        order.userid,
        foodIds,
        order.status
      ];

      client.query(insertQuery, values, (err, result) => {
        if (err) {
          console.log('Error:', err);
          return res.status(500).json({ error: 'Insertion was NOT successful: ' + err.message });
        }

        res.status(200).json({ message: 'Insertion was successful' });
      });
    });
  });
});


app.get('/orders', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  jwt.verify(token, 'secretKey', (err, authData) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const { userid } = req.query;

    if (!userid) {
      return res.status(400).json({ message: 'userid is required' });
    }

    let query;
    const values = [];
    if (parseInt(userid, 10) === 1) {
      query = 'SELECT * FROM orders ORDER BY id';
    } else {
      query = 'SELECT * FROM orders WHERE userid = $1 ORDER BY id';
      values.push(userid);
    }

    client.query(query, values, (err, result) => {
      if (err) {
        console.log('Error:', err);
        return res.status(500).json({ error: 'Failed to fetch orders: ' + err.message });
      }

      const mappedResults = result.rows.map(order => ({
        ...order,
        status: parseInt(order.status, 10),
      }));
      
      res.status(200).json(mappedResults);
    });
  });
});

app.put('/orders/:id', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  jwt.verify(token, 'secretKey', (err, authData) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const orderId = req.params.id;
    const order = req.body;

    const updateQuery = `
      UPDATE orders
      SET 
        name = $1,
        totalPrice = $2,
        address = $3,
        userid = $4,
        status = $5,
        foodid = $6::int[]
      WHERE id = $7
      RETURNING *;
    `;

    const values = [
      order.name,
      order.totalPrice,
      order.address,
      order.userid,
      order.status,
      order.foodid,
      orderId
    ];

    client.query(updateQuery, values, (err, result) => {
      if (err) {
        console.log('Error:', err);
        return res.status(500).json({ error: 'Failed to update order: ' + err.message });
      }

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json({ message: 'Order updated successfully', order: result.rows[0] });
    });
  });
});

app.post('/send-email', async (req, res) => {
  const { email, subject, text } = req.body;

  if (!email || !subject || !text) {
    return res.status(400).json({ message: 'Missing required fields: email, subject, or text' });
  }

  try {
    const result = await sendEmail(email, subject, text);
    res.status(200).json({ message: 'Email sent successfully', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/food/:id/rate', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be a number between 1 and 5." });
  }

  try {
    const insertQuery = `
      INSERT INTO food_ratings (food_id, user_id, rating)
      VALUES ($1, $2, $3)
    `;
    await client.query(insertQuery, [id, req.user.id, rating]);

    const avgQuery = `
      SELECT AVG(rating) as average_rating
      FROM food_ratings
      WHERE food_id = $1
    `;
    const avgResult = await client.query(avgQuery, [id]);
    const averageRating = parseFloat(avgResult.rows[0].average_rating).toFixed(2);

    const updateQuery = `
      UPDATE food
      SET average_rating = $1
      WHERE id = $2
    `;
    await client.query(updateQuery, [averageRating, id]);

    res.status(200).json({ message: "Rating added successfully", averageRating });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to add rating" });
  }
});

app.get('/food/:id/ratings', async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT *
      FROM food_ratings
      WHERE food_id = $1
    `;
    const result = await client.query(query, [id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
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
