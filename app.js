const express = require('express');
const fs = require('fs');
const cookieParser = require('cookie-parser');

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/login', (req, res) => {
  res.send(`
    <form method="post" action="/login">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username">
      <button type="submit">Log In</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username } = req.body;

  res.cookie('username', username);
  
  // Redirect the user to the home page
  res.redirect('/');
});

app.post('/', (req, res) => {
  const { username } = req.cookies;
  const message = req.body.message;

  fs.appendFile('messages.txt', `${username}: ${message}\n`, (err) => {
    if (err) throw err;
    console.log('Message written to file');
  });

  res.redirect('/');
});

app.get('/', (req, res) => {
  const { username } = req.cookies;

  fs.readFile('messages.txt', 'utf8', (err, data) => {
    if (err) throw err;

    const messages = data.trim().split('\n').map(line => `<p>${line}</p>`).join('');

    res.send(`
      ${messages}
      <form method="post" action="/">
        <label for="message">Message:</label>
        <input type="text" id="message" name="message">
        <button type="submit">Send</button>
      </form>
    `);
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
