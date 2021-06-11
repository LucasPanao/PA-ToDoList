const express = require('express');
const app = express();

const {mongoose} = require('./db/mongoose') 

const bodyParser = require('body-parser')

// Load mongoose models
const {List, Task, User} = require('./db/models')

//Middleware

//load middleware
app.use(bodyParser.json());

// CORS ENABLE
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET,POST,HEAD,OPTIONS,PUT,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
  });

// verify refresh token

let verifySession = ((req,res,next) => {
     // grab the refresh token
     let refreshToken = req.header('x-refresh-token');

     // grab the _id
     let _id = req.header('_id');
 
     User.findByIdAndToken(_id, refreshToken).then((user) => {
         if (!user) {
             // user couldn't be found
             return Promise.reject({
                 'error': 'Usuário não encontrado'
             });
         }

         // user found

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            next();
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token expirado ou invalido'
            })
        }
    }).catch((e) => {
        res.status(401).send(e);
    })
})

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
        res.send({message: 'Atualizado'});
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

// USER ROUTES

/**
 * POST /users
 * Purpose: Sign up
 */
 app.post('/users', (req, res) => {
    // User sign up

    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Sucess
        return newUser.generateAccessAuthToken().then((accessToken) => {
            // token genereted
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // auth Token
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})


/**
 * POST /users/login
 * Purpose: Login
 */
app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Sucess
            return user.generateAccessAuthToken().then((accessToken) => {
                // token genereted
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // auth token
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */
 app.get('/users/me/access-token', verifySession, (req, res) => {
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})


app.listen(3000, () => {
    console.log("Servidor na porta 3000")
})