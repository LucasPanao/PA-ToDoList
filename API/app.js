const express = require('express');
const app = express();

/* ROUTE HANDLERS */

/* LIST ROUTES */

/* GET /list
 * Do: GET all lists 
 */

app.get('/', (req,res) => {
    
})

/* POST /lists
*  Do: CREATE a list
*/

app.post('/lists', (req,res) => {

})

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