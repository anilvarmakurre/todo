const express = require("express");
const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "todoApplication.db");
let database = null;

const initializeDBandServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => console.log("Server is running...."));
  } catch (error) {
    console.log(`error message ${error.message}`);
    process.exit(1);
  }
};
initializeDBandServer();

// app.get("/todos/", async (request, response) => {
//   const { status = "" } = request.query;
//   console.log(status);
//   const getQuery = `
//     SELECT * FROM todo WHERE status='${status}';`;
//   const getResponse = await database.all(getQuery);
//   console.log(getResponse);
//   response.send(getResponse);
// });

// app.get("/todos/", async (request, response) => {
//   const { priority = "" } = request.query;
//   console.log(priority);
//   const getQuery = `
//     SELECT * FROM todo WHERE priority='${priority}';`;
//   const getResponse = await database.all(getQuery);
//   console.log(getResponse);
//   response.send(getResponse);
// });

// app.get("/todos/", async (request, response) => {
//   const { priority = "", status = "" } = request.query;
//   const getQuery = `
//     SELECT * FROM todo WHERE priority='${priority}' and status='${status}';`;
//   const getResponse = await database.all(getQuery);
//   console.log(getResponse);
//   response.send(getResponse);
// });

app.get("/todos/", async (request, response) => {
  const { search_q = "", priority = "", status = "" } = request.query;
  console.log(search_q);
  const getQuery = `
    SELECT * FROM todo WHERE todo LIKE '%${search_q}%' or priority='${priority}' or status='${status}';`;
  const getResponse = await database.all(getQuery);
  console.log(getResponse);
  response.send(getResponse);
});

app.get("/todos/:todoId/", async (request, response) => {
  const { search_q } = request.query;
  const { todoId } = request.params;
  const getQuery = `
    SELECT * FROM todo WHERE id=${todoId};`;
  const getResponse = await database.get(getQuery);
  console.log(getResponse);
  response.send(getResponse);
});

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const postQuery = `
  INSERT INTO todo (id,todo,priority,status) values ('${id}','${todo}','${priority}','${status}')`;

  const postResponse = await database.run(postQuery);
  console.log(postResponse);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { status, priority, todo } = request.body;
  console.log(status, priority, todo);
  const putQuery = `
    UPDATE todo SET status='${status}',priority='${priority}',todo='${todo}' WHERE id=${todoId};`;
  const putResponse = await database.run(putQuery);
  console.log(putResponse);
  response.send("Status Updated");
});

// app.put("/todos/:todoId/", async (request, response) => {
//   const { todoId } = request.params;
//   const { priority } = request.body;
//   const putQuery = `
//     UPDATE todo SET priority='${priority}' WHERE id=${todoId};`;
//   const putResponse = await database.run(putQuery);
//   console.log(putResponse);
//   response.send("Priority Updated");
// });

// app.put("/todos/:todoId/", async (request, response) => {
//   const { todoId } = request.params;
//   const { todo } = request.body;
//   console.log(todo);
//   const putQuery = `
//     UPDATE todo SET todo='${todo}' WHERE id=${todoId};`;
//   const putResponse = await database.run(putQuery);
//   console.log(putResponse);
//   response.send("Todo Updated");
// });

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  console.log(todoId);
  const deleteQuery = `
    DELETE FROM todo WHERE id=${todoId};`;
  const deleteResponse = await database.run(deleteQuery);
  console.log(deleteQuery);
  response.send("Todo Deleted");
});
module.exports = app;
