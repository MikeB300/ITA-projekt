import pg from 'pg';
import dotenv from 'dotenv';
import { upload } from 'pg-upload'; // make sure this is installed

dotenv.config(); // load .env config

console.log('Connecting to database', process.env.PG_DATABASE); // write in log that its trying to connect to the db

const db = new pg.Pool({
    host:     process.env.PG_HOST, // db hostname
    port:     parseInt(process.env.PG_PORT), // db port number
    database: process.env.PG_DATABASE, // db name
    user:     process.env.PG_USER, // db user
    password: process.env.PG_PASSWORD, // db password
    ssl:      { rejectUnauthorized: false }, // ssl true/false
});

const dbResult = await db.query('select now()');
console.log('Database connection established on', dbResult.rows[0].now);

// drop the table if it already exits. Create the table if it doesnt exist and insert theese columns with theese constraints
await db.query(`
    drop table if exists "co2_data";
    create table "co2_data" (
        Entity text,
        Code text,
        Year integer,
        GDP_per_capita numeric,
        Annual_CO2_emissions_per_capita numeric,
        Per_capita_consumption_based_CO2_emissions numeric
    );
`);

// Upload the CSV file into the table
await upload(
    db,
    'db/data/co2-emissions-and-gdp-per-capita.csv',
    `copy "co2_data" from stdin with (format csv, header true)`
);

