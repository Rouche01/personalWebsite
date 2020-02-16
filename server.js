require ('dotenv').config(); //read .env files
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./build/config.development.js');
const compiler = webpack(config);
const port = process.env.PORT || 3000;

const { allPosts, allResources  } = require('./src/js/lib/datocms-service')

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
}));

// set public folder as root
app.use(express.static('dist'));

// // Allow front-end access to node_modules folder
// app.use('/scripts', express.static(`${__dirname}/node_modules/`));

// Express error handler
const errorHandler = (err, req, res) => {
    if(err.response) {
        res.status(403).send({title: 'Server responded with an error', message: err.message });
    } else if(err.request) {
        res.status(503).send({title: 'Unable to communicate with server', message: err.message});
    } else {
        res.status(500).send({title: 'An unexpected error occured', message: err.message});
    }
};

// Fetch Blog Content
app.get('/api/blogposts', async (req, res) => {
    try {
        const data = await allPosts();
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    } catch(error) {
        errorHandler(error, req, res);
    }
});

app.get('/api/resources', async (req, res) => {
    try {
        const data = await allResources();
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    } catch(error) {
        errorHandler(error, req, res);
    }
});

// Redirect All traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/dist/index.html`));

// Listen for HTTP requests on port 3000
app.listen(port, () => {
    console.log('listening on %d', port);
});


// const test = async () => {
//     const data = await allPosts();
//     console.log(data);
// }

// test();

