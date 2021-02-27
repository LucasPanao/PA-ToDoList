const express = require('express');
const app = express();

const {mongoose} = require('./db/mongoose') 

const bodyParser = require('body-parser')

// Load mongoose models
const {List, Task} = require('./db/models')

//load middleware
app.use(bodyParser.json());

// CORS ENABLE
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

/* ROUTE HANDLERS */

/* LIST ROUTES */

/* GET /list
 * Do: GET all lists 
 */

app.get('/lists', (req,res) => {
    List.find({}).then((lists) => {
        res.send(lists)
    });
})

/* POST /lists
*  Do: CREATE a list
*/

app.post('/lists', (req,res) => {
    let title = req.body.title
    let newList = new List ({
        title
    });
    newList.save().then((listDoc) => {
    res.send(listDoc)
    });
});

/**
 * PATH /lists/:id
 * Do: Update a specified list
 */
app.patch('/lists/:id', (req,res) => {
    List.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

/**
 * DELETE /lists/:id
 * Do: Delete a specified list
 */
app.delete('/lists/:id', (req,res) => {
    List.findOneAndRemove({
        _id: req.params.id
    }).then((removedListDoc) =>{
        res.send(removedListDoc)
    });
});

/**
 * GET /lists/:listId/tasks
 * Do: Get all tasks from specific list
 */
app.get('/lists/:listId/tasks', (req,res) => {
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks)
    })
});

/* POST /lists/:listId/tasks
*  Do: CREATE a new task in a specific listId
*/

app.post('/lists/:listId/tasks', (req,res) => {
    let newTask = new Task ({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc) => {
    res.send(newTaskDoc)
    });
});

/**
 * PATCH /lists/:listId/tasks/:taskId
 * Do: Update an existing task
 */

app.patch('/lists/:listId/tasks/:taskId', (req,res) => {
    Task.findOneAndUpdate({ 
        _id: req.params.taskId,
        _listId: req.params.listId
     }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Do: Delete a task
 */

app.delete('/lists/:listId/tasks/:taskId', (req,res) => {
    Task.findOneAndRemove({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((removedTaskDoc) =>{
        res.send(removedTaskDoc)
    });
});

app.listen(3000, () => {
    console.log("Servidor na porta 3000")
})