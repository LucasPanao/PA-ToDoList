//connection to MongoDB DB

const mongoose = require('mongoose')

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TaskManager', {useNewUrlParser: true }).then(() => {
    console.log('conectado');
}).catch((e) => {
    console.log('erro ao conectar');
    console.log(e);
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = {
    mongoose
}