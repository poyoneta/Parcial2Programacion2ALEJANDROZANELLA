const sql = require('mssql');

const dbConfig = {
    server: '127.0.0.1', 
    database: 'CursosBD',
    port: 1433,
    options: {
        encrypt: false, 
        trustServerCertificate: true, 
        trustedConnection: true 
    }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Conectado a SQL Server con éxito.');
        return pool;
    })
    .catch(err => {
        console.error('Error de conexión a la Base de Datos: ', err);
        process.exit(1);
    });

module.exports = { sql, poolPromise };