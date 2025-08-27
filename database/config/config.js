
module.exports = {
    development: {
        username: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || "database_development",
        // host: "localhost",
        port: 3306,
        dialect: 'mysql',
        host: "44.209.102.190",
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        // host: "localhost",
        port: 3306,
        dialect: 'mysql',
        host: "44.209.102.190",
    },
    test: {
        username: "root",
        password: null,
        database: "database_test",
        host: "127.0.0.1",
        dialect: 'mysql',
    }
};