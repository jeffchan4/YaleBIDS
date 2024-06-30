// test-db.js

// Require the db.js file
const db = require('./mockconnection');

// Define an async function to test the database connection
async function testDatabaseConnection() {
  try {
    // Wait for the connection pool to be created
    const pool = await db.poolPromise;

    // Use the pool to query the database (example query)
    const result = await pool.request().query('SELECT @@version AS version');
    console.log('Database connection successful.');
    console.log('SQL Server version:', result.recordset[0].version);
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    // Close the pool when testing is done (optional)
    await db.sql.close();
    console.log('Database connection closed.');
  }
}

// Call the test function
testDatabaseConnection();
