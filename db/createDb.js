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

await db.query(`
	drop table if exists "co2_data1";
	create table "co2_data1" (
		country	text,
		year	integer,
		iso_code	text,
		population	numeric,
		gdp	numeric,
		biofuel_cons_change_pct	numeric,
		biofuel_cons_change_twh	numeric,
		biofuel_cons_per_capita	numeric,
		biofuel_consumption	numeric,
		biofuel_elec_per_capita	numeric,
		biofuel_electricity	numeric,
		biofuel_share_elec	numeric,
		biofuel_share_energy	numeric,
		carbon_intensity_elec	numeric,
		coal_cons_change_pct	numeric,
		coal_cons_change_twh	numeric,
		coal_cons_per_capita	numeric,
		coal_consumption	numeric,
		coal_elec_per_capita	numeric,
		coal_electricity	numeric,
		coal_prod_change_pct	numeric,
		coal_prod_change_twh	numeric,
		coal_prod_per_capita	numeric,
		coal_production	numeric,
		coal_share_elec	numeric,
		coal_share_energy	numeric,
		electricity_demand	numeric,
		electricity_generation	numeric,
		electricity_share_energy	numeric,
		energy_cons_change_pct	numeric,
		energy_cons_change_twh	numeric,
		energy_per_capita	numeric,
		energy_per_gdp	numeric,
		fossil_cons_change_pct	numeric,
		fossil_cons_change_twh	numeric,
		fossil_elec_per_capita	numeric,
		fossil_electricity	numeric,
		fossil_energy_per_capita	numeric,
		fossil_fuel_consumption	numeric,
		fossil_share_elec	numeric,
		fossil_share_energy	numeric,
		gas_cons_change_pct	numeric,
		gas_cons_change_twh	numeric,
		gas_consumption	numeric,
		gas_elec_per_capita	numeric,
		gas_electricity	numeric,
		gas_energy_per_capita	numeric,
		gas_prod_change_pct	numeric,
		gas_prod_change_twh	numeric,
		gas_prod_per_capita	numeric,
		gas_production	numeric,
		gas_share_elec	numeric,
		gas_share_energy	numeric,
		greenhouse_gas_emissions	numeric,
		hydro_cons_change_pct	numeric,
		hydro_cons_change_twh	numeric,
		hydro_consumption	numeric,
		hydro_elec_per_capita	numeric,
		hydro_electricity	numeric,
		hydro_energy_per_capita	numeric,
		hydro_share_elec	numeric,
		hydro_share_energy	numeric,
		low_carbon_cons_change_pct	numeric,
		low_carbon_cons_change_twh	numeric,
		low_carbon_consumption	numeric,
		low_carbon_elec_per_capita	numeric,
		low_carbon_electricity	numeric,
		low_carbon_energy_per_capita	numeric,
		low_carbon_share_elec	numeric,
		low_carbon_share_energy	numeric,
		net_elec_imports	numeric,
		net_elec_imports_share_demand	numeric,
		nuclear_cons_change_pct	numeric,
		nuclear_cons_change_twh	numeric,
		nuclear_consumption	numeric,
		nuclear_elec_per_capita	numeric,
		nuclear_electricity	numeric,
		nuclear_energy_per_capita	numeric,
		nuclear_share_elec	numeric,
		nuclear_share_energy	numeric,
		oil_cons_change_pct	numeric,
		oil_cons_change_twh	numeric,
		oil_consumption	numeric,
		oil_elec_per_capita	numeric,
		oil_electricity	numeric,
		oil_energy_per_capita	numeric,
		oil_prod_change_pct	numeric,
		oil_prod_change_twh	numeric,
		oil_prod_per_capita	numeric,
		oil_production	numeric,
		oil_share_elec	numeric,
		oil_share_energy	numeric,
		other_renewable_consumption	numeric,
		other_renewable_electricity	numeric,
		other_renewable_exc_biofuel_electricity	numeric,
		other_renewables_cons_change_pct	numeric,
		other_renewables_cons_change_twh	numeric,
		other_renewables_elec_per_capita	numeric,
		other_renewables_elec_per_capita_exc_biofuel	numeric,
		other_renewables_energy_per_capita	numeric,
		other_renewables_share_elec	numeric,
		other_renewables_share_elec_exc_biofuel	numeric,
		other_renewables_share_energy	numeric,
		per_capita_electricity	numeric,
		primary_energy_consumption	numeric,
		renewables_cons_change_pct	numeric,
		renewables_cons_change_twh	numeric,
		renewables_consumption	numeric,
		renewables_elec_per_capita	numeric,
		renewables_electricity	numeric,
		renewables_energy_per_capita	numeric,
		renewables_share_elec	numeric,
		renewables_share_energy	numeric,
		solar_cons_change_pct	numeric,
		solar_cons_change_twh	numeric,
		solar_consumption	numeric,
		solar_elec_per_capita	numeric,
		solar_electricity	numeric,
		solar_energy_per_capita	numeric,
		solar_share_elec	numeric,
		solar_share_energy	numeric,
		wind_cons_change_pct	numeric,
		wind_cons_change_twh	numeric,
		wind_consumption	numeric,
		wind_elec_per_capita	numeric,
		wind_electricity	numeric,
		wind_energy_per_capita	numeric,
		wind_share_elec	numeric,
		wind_share_energy	numeric
	);
`);


// Upload the CSV file into the table
await upload(
    db,
    'data/co2-emissions-and-gdp-per-capita.csv', // dataset0
    `copy "co2_data" from stdin with (format csv, header true)`
);

await upload(
    db,
    'data/owid-energy-data.csv', // dataset1
    `copy "co2_data1" from stdin with (format csv, header true)`
);
