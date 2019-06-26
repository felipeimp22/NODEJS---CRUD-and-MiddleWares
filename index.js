const express = require("express");

const server = express();
server.use(express.json());

// middleware global
//middleware of log
server.use((req, res, next) => {
  console.time("Request"); // will count the time of your req
  console.log("middleware chamado");
  console.log(`metodo:${req.method}  -  URL: ${req.url} `);
  next();
  console.timeEnd("Request"); // will count the end time of your req
}); //next() is to continue the flow after passing through the middleware

//middleware that check name in req
function checkName(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "user name is require" });
  }
  return next();
}
//middleware that check if index exists
function checkIndex(req, res, next) {
  const { index } = req.params;
  if (!users[req.params.index]) {
    return res
      .status(400)
      .json({ error: `does not exist this index: ${index}` });
  }

  return next();
}
//or
/*function checkName(req,res,next){
const user = users[req.params.index];
if(!user){
  return res.status(400).json({error:`does not exist this index: ${index}` });
}
req.user = user;
return next()
}

and after :

server.get("/users/:index", checkIndex, (req, res) => {
  const { index } = req.params;
  return res.json(user); <-- let just user
});


*/

//query params = ?name=1
//route params = /users/1
//rquest body = {name:"name"}

//query params
//server.get("/teste", (req, res) => {
//const name = req.query.name;
// return res.json({ message: `Hello ${name}` });
//})

//routes params
//server.get("/user/:id", (req, res) => {
//const id = req.params.id; //ou const {id} = req.params;
//return res.json({ message: `buscando o ${id}` });
//});

//CRUD - create, read, update, delete

//Array of users
const users = ["Felipe", "Caroline", "imperio"];

//show all users
server.get("/users", (req, res) => {
  return res.json(users);
});
//show only an user
server.get("/users/:index", checkIndex, (req, res) => {
  const { index } = req.params;
  return res.json(users[index]);
});
//create users
server.post("/users", checkName, (req, res) => {
  const { name } = req.body;
  users.push(name);

  return res.json(users);
});

//update and change name
server.put("/users/:index", checkName, checkIndex, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;
  return res.json(users);
});

//delete name
server.delete("/users/:index", checkIndex, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1); //splice run throghout users and after delete the position
  return res.send();
});

server.listen(3000);
