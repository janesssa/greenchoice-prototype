import express, { static } from 'express';
import { join } from 'path';
const app = express();
import { json } from "body-parser";
      port = 3080;

// place holder for the data
const users = [];

app.use(json());
app.use(static(join(__dirname, '../app/build')));

app.get('/api/users', (req, res) => {
  console.log('api/users called!')
  res.json(users);
});

app.post('/api/user', (req, res) => {
  const user = req.body.user;
  console.log('Adding user:::::', user);
  users.push(user);
  res.json("user addedd");
});

app.get('/', (req,res) => {
  res.sendFile(join(__dirname, '../my-app/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});