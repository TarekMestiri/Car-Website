const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

// Registration route
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  const newUser = new User({ username, email, password });

  newUser.save()
    .then(() => res.send('Registration successful!'))
    .catch(err => res.status(500).send(err.message));
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ $or: [{ username }, { email: username }] })
    .then(user => {
      if (!user) {
        res.status(404).send('User not found!');
      } else {
        if (password === user.password) {
          res.send('Login successful!');
        } else {
          res.status(401).send('Invalid password!');
        }
      }
    })
    .catch(err => res.status(500).send(err.message));
});
// Route to access the website after login
app.get('/CARENTHUSIASTS', requireLogin, (req, res) => {
    res.send('Welcome to the website!');
  });
  const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
