import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // read .env file
console.log('Connecting to database', process.env.PG_DATABASE);
const db = new pg.Pool({
    host:     process.env.PG_HOST,
    port:     parseInt(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    user:     process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl:      { rejectUnauthorized: false },
});
const dbResult = await db.query('select now() as now');
console.log('Database connection established on', dbResult.rows[0].now);

import express from 'express';

console.log('Initialising webserver...');
const port = 3006;
const server = express();
server.use(express.static('frontend'));
server.use(onEachRequest)
server.get('/api/albums', onGetAlbums);
server.get('/api/slice', onGetSlice);
server.get('/api/year', onGetyear);
server.listen(port, onServerReady);

function onEachRequest(request, response, next) {
    console.log(new Date(), request.method, request.url);
    next();
}

function onServerReady() {
    console.log('Webserver running on port', port);
}

async function onGetAlbums(request, response) {
    const dbResult = await db.query('select * from albums');
    response.json(dbResult.rows);
}

async function onGetSlice(request, response) {
    const dbResult = await db.query('select year as released, title, artist from albums where year <1980')
    response.json(dbResult.rows); 
}
async function onGetyear(request, response) {
    const dbResult = await db.query('select year from albums')
    response.json(dbResult.rows);
}