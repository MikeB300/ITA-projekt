import pg from 'pg';
import dotenv from 'dotenv';
import { upload } from 'pg-upload'; // make sure this is installed

dotenv.config();

console.log('Connecting to database', process.env.PG_DATABASE);

const db = new pg.Pool({
    host:     process.env.PG_HOST,
    port:     parseInt(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    user:     process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl:      { rejectUnauthorized: false },
});

const dbResult = await db.query('select now()');
console.log('Database connection established on', dbResult.rows[0].now);

// Drop & create table matching CSV
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


// Upload CSV into the table
await upload(
    db,
    'data/co2-emissions-and-gdp-per-capita.csv',
    `copy "co2_data" from stdin with (format csv, header true)`
);

