const express = require('express');
const app = express();

const {mongoose} = require('./db/mongoose') 

const bodyParser = require('body-parser')

// Load mongoose models
const {List, Task} = require('./db/models')

//load middleware
app.use(bodyParser.json());

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

})

/**
 * DELETE /lists/:id
 * Do: Delete a specified list
 */
app.delete('/lists/:id', (req,res) => {

})

app.listen(3000, () => {
    console.log("Servidor na porta 3000")
})