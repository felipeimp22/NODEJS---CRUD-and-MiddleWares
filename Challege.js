//APP init
const express = require("express");
const App = express();
App.use(express.json());
App.listen(3000);
//------------------------------------------------------------------------------
// Data Base
const projects = [
  {
    id: 0,
    title: "novo projeto",
    tasks: ["nova tarefa"]
  },
  {
    id: 1,
    title: "novo projeto",
    tasks: ["nova tarefa"]
  }
];
const timer = [];
//------------------------------------------------------------------------------
//-------------------------------MIDDLEWARES -----------------------------------
//------------------------------------------------------------------------------
// Global Middleware
/*List time of requisition, method, url used
 and count how many requisitions were made */
App.use((req, res, next) => {
  timer.push(req.url);
  console.time("Request");
  console.log("MiddleWare Enabled");
  console.log(`method: ${req.method} and  URL: ${req.url}`);
  next();
  console.timeEnd("Request");
  console.log(`requisitions:  ${timer.length}`);
});
//------------------------------------------------------------------------------
//middleware that identifies the id
function trueId(req, res, next) {
  const { id } = req.params;
  if (!projects[req.params.id]) {
    return res.status(400).json({ Error: `Does not exist ID: ${id}` });
  }
  return next();
}
//------------------------------------------------------------------------------
//------------------------------CRUD--------------------------------------------
//------------------------------------------------------------------------------
// show all projects
App.get("/projects", (req, res) => {
  return res.json(projects);
});
//------------------------------------------------------------------------------
// show only one project
App.get("/projects/:id", trueId, (req, res) => {
  const { id } = req.params;
  return res.json(projects[id]);
});
//------------------------------------------------------------------------------
// create a new projects
/* OBS*: ID is set automatically */
App.post("/projects", (req, res) => {
  const { title, tasks } = req.body;
  const projectsLength = projects.length;
  projects.push({ id: projectsLength, title: title, tasks: tasks });
  return res.json(projects);
});
/* Test in insomnia:
{
	"title": "novo projeto",
	"tasks": ["nova tarefa"]	
}
OBS*: Body JSON without ID
*/
//------------------------------------------------------------------------------
//Update and change title looking by id
App.put("/projects/:id", trueId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const src = projects.find(seek => seek.id == id);
  src.title = title;
  return res.json(projects);
});
//------------------------------------------------------------------------------
//Delete a project
App.delete("/projects/:id", trueId, (req, res) => {
  const { id } = req.params;
  projects.splice(id, 1);
  return res.json(projects);
});
//------------------------------------------------------------------------------
//Exclude  Tasks by Id
App.get("/projects/:id/tasks", (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;
  const src = projects.find(seek => seek.id == id);
  src.tasks = tasks;
  return res.json(projects);
});
//------------------------------------------------------------------------------
// Include and change task by ID
App.post("/projects/:id/tasks", trueId, (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;
  const src = projects.find(seek => seek.id == id);
  src.tasks = tasks;
  return res.json(projects);
});
/* in insomnia: http://localhost:3000/projects/1/tasks
{
	"tasks": ["teste 1", "teste2"]
}
*/
//------------------------------------------------------------------------------
