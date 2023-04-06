const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/login', (req, res, next) => {
    res.send('<form action="/login" method="POST"><input type="text" name="username"><button type="submit">Login</button></form>');
});

router.post('/login', (req, res, next) => {
    const username = req.body.username;
    // Store the username in the browser's local storage
    res.locals.username = username;
    res.redirect('/');
});

router.get('/', (req, res, next) => {
    const username = res.locals.username;
    let messageForm = '';
    if (username) {
        messageForm = `<form action="/send-message" method="POST">Welcome ${username}<br><input type="text" name="message"><button type="submit">Send Message</button></form>`;
    } else {
        messageForm = 'Please login first.';
    }
    res.send(messageForm);
});

router.post('/send-message', (req, res, next) => {
    const username = res.locals.username;
    const message = req.body.message;
    // Store the message in a file with the username as a key
    const newMessage = { [username]: message };
    const messagesFilePath = 'messages.json';
    let messages = {};
    // Read the existing messages from the file
    try {
        const messagesJson = fs.readFileSync(messagesFilePath);
        messages = JSON.parse(messagesJson);
    } catch (err) {
        console.error(err);
    }
    // Append the new message to the existing messages
    messages = { ...messages, ...newMessage };
    // Write the updated messages to the file
    try {
        const messagesJson = JSON.stringify(messages);
        fs.writeFileSync(messagesFilePath, messagesJson);
    } catch (err) {
        console.error(err);
    }
    // Send a response to the client with the username who sent the message
    res.send(`Message sent by ${username}: ${message}`);
});

module.exports = router;
