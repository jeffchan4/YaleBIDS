const sql = require('mssql');
const config = require('./config'); // Ensure config.js has your database connection details

async function createTable() {
    try {
      // Connect to the database
      await sql.connect(config);
  
      // Define SQL query to create the table
      const query = `
        CREATE TABLE tasks (
          task_id NVARCHAR(50) PRIMARY KEY,
          query NVARCHAR(MAX),
          status NVARCHAR(50),
          result NVARCHAR(MAX),
          created_time NVARCHAR(MAX),
          start_time DATETIME,
          run_seconds INT
        );
      `;
  
      // Execute the query
      await sql.query(query);
  
      console.log('Table created successfully.');
    } catch (err) {
      console.error('Error creating table:', err.message);
    } finally {
      // Close the SQL connection
      try {
        await sql.close();
        console.log('Connection closed.');
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }


  
  
  async function fetchColumns(tableName) {
    try {
      await sql.connect(config);
  
      // Prepare query to fetch columns
      const query = `
        SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = @tableName
        ORDER BY ORDINAL_POSITION
      `;
  
      // Create a new Request object
      const request = new sql.Request();
  
      // Bind parameters
      request.input('tableName', sql.NVarChar(128), tableName);
  
      // Execute query
      const result = await request.query(query);
  
      // Output columns information
      console.log('Columns for table:', tableName);
      console.table(result.recordset);
    } catch (err) {
      console.error('Error fetching columns:', err.message);
    } finally {
      sql.close();
    }
  }
  async function insertTask(taskData) {
    try {
      await sql.connect(config);
  
      // Prepare insert query
      const query = `
        INSERT INTO tasks (task_id, query, status, result, created_time, start_time, run_seconds)
        VALUES (@task_id, @query, @status, @result, @created_time, @start_time, @run_seconds)
      `;
      
      // Create a new Request object
      const request = new sql.Request();
  
      // Bind parameters
      request.input('task_id', sql.NVarChar(50), taskData.task_id);
      request.input('query', sql.NVarChar(sql.MAX), taskData.query);
      request.input('status', sql.NVarChar(50), taskData.status);
      request.input('result', sql.NVarChar(sql.MAX), taskData.result);
      request.input('created_time', sql.NVarChar(sql.MAX), taskData.created_time);
      request.input('start_time', sql.DateTime, taskData.start_time);
      request.input('run_seconds', sql.Int, taskData.run_seconds);
  
      // Execute insert query
      const result = await request.query(query);
  
      console.log('Rows affected:', result.rowsAffected);
    } catch (err) {
      console.error('Error inserting data:', err.message);
    } finally {
      sql.close();
    }
  }
  
  // Example data to insert
  const taskData = {
    task_id: 'aa4bb5eb-968e-4b16-a542-b562c488d322', // Example primary key value
    query: 'test',
    status: 'Pending',
    result: '',
    created_time: '2024-06-30 12:00:00',
    start_time: new Date(),
    run_seconds: 0
  };
  
  // Insert data
//   insertTask(taskData);
  
  // Example: Fetch columns for 'tasks' table
  async function fetchAllTasks() {
    try {
      await sql.connect(config);
  
      // Prepare query to fetch all data from the tasks table
      const query = 'SELECT * FROM tasks';
  
      // Create a new Request object
      const request = new sql.Request();
  
      // Execute query
      const result = await request.query(query);
  
      // Output all rows
      console.table(result.recordset);
    } catch (err) {
      console.error('Error fetching data:', err.message);
    } finally {
      sql.close();
      console.log('successful close')
    }
  }
  
  // Fetch all data from the tasks table
  fetchAllTasks();
