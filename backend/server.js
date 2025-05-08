import pg from 'pg'; // import required modules/packages
import dotenv from 'dotenv';

dotenv.config(); // read .env file
console.log('Connecting to database', process.env.PG_DATABASE); // use creds from .env file
const db = new pg.Pool({
    host:     process.env.PG_HOST,
    port:     parseInt(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    user:     process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl:      { rejectUnauthorized: false },
});
const dbResult = await db.query('select now() as now');
console.log('Database connection established on', dbResult.rows[0].now); // log connection

import express from 'express';

console.log('Initialising webserver...');
const port = 3006; // port number for website
const server = express();
server.use(express.static('frontend'));
server.use(onEachRequest)
server.get('/api/data', onGetdata); // api endpoint for onGetdata function
server.get('/api/data1', onGetdata1); // api endpoint for onGetdata function
server.listen(port, onServerReady);

function onEachRequest(request, _response, next) {
    console.log(new Date(), request.method, request.url); // log the time, method and url on each request
    next();
}

function onServerReady() {
    console.log('Webserver running on port', port); // log server port
}

async function onGetdata(_request, response) {
    const dbResult = await db.query('select * from co2_data'); // type query here
    response.json(dbResult.rows); // json response from the db query
}
async function onGetdata1(_request, response) {
    const dbResult = await db.query('select * from co2_data1'); // type query here
    response.json(dbResult.rows); // json response from the db query
}