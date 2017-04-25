export default {
    // Secret key for JWT signing and encryption
    secret: 'topSecret234oi23o423ooqnafsnaaslfj',

    // Database connection information
    database: `mongodb://${process.env.DB_HOST || "localhost"}:27017`,

    // Setting port for server
    port: process.env.PORT || 3030
};
