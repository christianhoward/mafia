// determine what credentials to use

if (process.env.NODE_ENV === 'production') {
    // production keys
    module.exports = require('./prod');
} else {
    // development keys
    console.log('using dev!');
    module.exports = require('./dev');
}