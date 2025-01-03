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
  const ids = req.query.ids; // Oczekuje tablicy ID w parametrze zapytania

  if (!ids) {
    return res.status(400).send('Food IDs are required.');
  }

  const idsArray = Array.isArray(ids) ? ids : ids.split(','); // Obsługa przypadku, gdy ids to string

  // Przygotowanie zapytania z użyciem parametrów
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

  // First, retrieve all existing user IDs
  client.query(`SELECT id FROM users ORDER BY id`, (err, result) => {
    if (err) {
      console.error('Error querying user IDs:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Generate the next available ID
    const existingIds = result.rows.map(row => +row.id);
    let nextId = 1;
    while (existingIds.includes(nextId)) {
      nextId++;
    }

    console.log('Generated next user ID:', nextId); // Debugging line to confirm nextId

    // Check if the user already exists by email
    client.query(`SELECT * FROM users WHERE email = $1`, [email], (err, result) => {
      if (err) {
        console.error('Error querying users:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      const existingUser = result.rows[0];
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Insert new user with generated ID
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

  // Query to get all existing IDs in the users table
  client.query(`SELECT id FROM users ORDER BY id`, (err, result) => {
    if (err) {
      console.error('Error querying user IDs:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Generate the next available ID
    const existingIds = result.rows.map(row => +row.id);
    let nextId = 1;
    while (existingIds.includes(nextId)) {
      nextId++;
    }

    // Check if the user already exists by email
    client.query(`SELECT * FROM users WHERE email = $1`, [email], (err, result) => {
      if (err) {
        console.error('Error querying users:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      const existingUser = result.rows[0];

      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
      
      
      // Insert new user with generated ID
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

      // Extract only the 'id' values from each item in req.body.items
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
  // Pobranie tokena z nagłówka autoryzacji
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  // Weryfikacja tokena JWT
  jwt.verify(token, 'secretKey', (err, authData) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const { userid } = req.query; // Zakładam, że userid będzie przesyłane jako query param

    // Jeżeli brak userid, zwróć błąd
    if (!userid) {
      return res.status(400).json({ message: 'userid is required' });
    }

    // Zapytanie SQL
    let query;
    const values = [];
    if (parseInt(userid, 10) === 1) {
      // Admin - pobiera wszystkie zamówienia
      query = 'SELECT * FROM orders ORDER BY id';
    } else {
      // Zwykły użytkownik - pobiera zamówienia tylko dla swojego userid
      query = 'SELECT * FROM orders WHERE userid = $1 ORDER BY id';
      values.push(userid);
    }

    // Wykonanie zapytania do bazy danych
    client.query(query, values, (err, result) => {
      if (err) {
        console.log('Error:', err);
        return res.status(500).json({ error: 'Failed to fetch orders: ' + err.message });
      }

      // Mapowanie tylko statusu na liczbę
      const mappedResults = result.rows.map(order => ({
        ...order,
        status: parseInt(order.status, 10), // Konwersja statusu na liczbę całkowitą
      }));
      
      // Zwrócenie wyników
      res.status(200).json(mappedResults);
    });
  });
});

app.put('/orders/:id', (req, res) => {
  // Pobranie tokena z nagłówka autoryzacji
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  // Weryfikacja tokena JWT
  jwt.verify(token, 'secretKey', (err, authData) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const orderId = req.params.id; // Pobranie ID zamówienia z URL
    const order = req.body; // Zamówienie do zaktualizowania z ciała żądania

    // Zapytanie SQL do aktualizacji zamówienia
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
      order.foodid, // Zakładam, że foodid jest tablicą
      orderId
    ];

    // Wykonanie zapytania do bazy danych
    client.query(updateQuery, values, (err, result) => {
      if (err) {
        console.log('Error:', err);
        return res.status(500).json({ error: 'Failed to update order: ' + err.message });
      }

      // Jeżeli nie znaleziono zamówienia
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Zwrócenie zaktualizowanego zamówienia
      res.status(200).json({ message: 'Order updated successfully', order: result.rows[0] });
    });
  });
});

app.post('/send-email', async (req, res) => {
  const { email, subject, text } = req.body;

  // Walidacja danych wejściowych
  if (!email || !subject || !text) {
    return res.status(400).json({ message: 'Missing required fields: email, subject, or text' });
  }

  try {
    // Wysyłanie e-maila
    const result = await sendEmail(email, subject, text);
    res.status(200).json({ message: 'Email sent successfully', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
