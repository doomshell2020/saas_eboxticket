
module.exports = {
    developmentV2: {
        username: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME,
        host: process.env.HOST || 'localhost',
        port: 3306,
        dialect: 'mysql',
    },
    development: {
        username: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || "database_development",
        host: "localhost",
        port: 3306,
        dialect: 'mysql',
        dialectOptions: {
            charset: "utf8mb4",
        },
        define: {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
        },
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: 3306,
        dialect: 'mysql',
        host: process.env.HOST,
    },
    test: {
        username: "root",
        password: null,
        database: "database_test",
        host: "127.0.0.1",
        dialect: 'mysql',
    }
};