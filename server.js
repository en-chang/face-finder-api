const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'face-finder'
  }
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '1234',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 4,
      joined: new Date()
    },
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'john@gmail.com'
    }
  ]
}

app.get('/', (req, res) => {
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  // Load hash from your password DB.
  bcrypt.compare("apples", "$2a$10$/8hzsGhmsPpxKdM5nbk6yORPYeWfYJYfCdkkDt7itF9K1/Fua72Mm", function(err, res) {
    console.log('first guess', res);
  });
  bcrypt.compare("!apples", "$2a$10$/8hzsGhmsPpxKdM5nbk6yORPYeWfYJYfCdkkDt7itF9K1/Fua72Mm", function(err, res) {
    console.log('second guess', res);
  });
  if (req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in');
  }
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        console.log(hash);
    });
  });
  db('users')
    .returning('*')
    .insert({
      name: name,
      email: email,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  })
  if (!found) {
    res.status(400).json('not found');
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++
      return res.json(user.entries);
    }
  })
  if (!found) {
    res.status(400).json('not found');
  }
})

app.listen(3000, () => {
})