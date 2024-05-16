import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import ViewCollegeCourse from './views/VCollegeCourse';
dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [`${__dirname}/entity/**/*.{js,ts}`, ViewCollegeCourse],
    migrations: [],
    subscribers: []
});