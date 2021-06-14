const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;
  if (password === undefined) {
    res.status(400).json('undefined password');
  }
  // Used to encrypt password
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  db.transaction(trx => {
    trx.insert({
      email: email,
      hash: hash
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          name: name,
          email: loginEmail[0],
          joined: new Date()
        })
        .then(user => {
          res.json(user[0]);
        })
    })
    .then(trx.commit)
    .then(trx.rollback)
    .catch(err => res.status(400).json('unable to register'))
  })
}

module.exports = {
  handleRegister
};