const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const sql = require('mssql');
const config = require('./config'); // Ensure config.js has your database connection details

const PORT = process.env.PORT || 5000;

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors());

const { v4: uuidv4 } = require('uuid');//random task_id generator 

app.get('/', (req, res) => {
    res.send('Hello, World!');
});
function getDateTime(){
    function pad(number) {
        return (number < 10 ? '0' : '') + number;
    }

    const currentDate = new Date();
    // Format the date and time
    const formattedDateTime = `${currentDate.getFullYear()}-${pad(currentDate.getMonth() + 1)}-${pad(currentDate.getDate())} ${pad(currentDate.getHours())}:${pad(currentDate.getMinutes())}:${pad(currentDate.getSeconds())}`;

    return formattedDateTime;
}


//put in db and deploy. maybe use microsoft.
let tasks= {}



// Function to insert a task into the tasks table
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
      request.input('result', sql.NVarChar(sql.MAX), taskData.result); // Store result as JSON string
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

  async function updateTask(taskId, newStatus, newResult, run_seconds) {
    try {
      await sql.connect(config);
  
      // Prepare update query
      const query = `
        UPDATE tasks
        SET status = @newStatus, result = @newResult, run_seconds = @run_seconds
        WHERE task_id = @taskId
      `;
  
      // Create a new Request object
      const request = new sql.Request();
  
      // Bind parameters
      request.input('taskId', sql.NVarChar(50), taskId);
      request.input('newStatus', sql.NVarChar(50), newStatus);
      request.input('newResult', sql.NVarChar(sql.MAX), newResult);
      request.input('run_seconds',sql.Int, run_seconds);
  
      // Execute update query
      const result = await request.query(query);
  
      console.log('Rows affected:', result.rowsAffected);
    } catch (err) {
      console.error('Error updating task:', err.message);
    } finally {
      sql.close();
    }
  }
  async function fetchTaskStatus(taskId) {
    try {
      // Connect to MSSQL
      await sql.connect(config);
  
      // Query to fetch status
      const result = await sql.query`SELECT status FROM tasks WHERE task_id = ${taskId}`;
  
      // Check if task found
      if (result.recordset.length > 0) {
        console.log(result.recordset[0].status)
        return result.recordset[0].status;
      } else {
        throw new Error(`Task with ID ${taskId} not found`);
      }
    } catch (err) {
      console.error('Error fetching task status:', err.message);
      throw err; // Propagate the error
    } finally {
      // Close MSSQL connection
      await sql.close();
    }
  }


const search_term= async (taskId,term,start_time) => {
    

    function extractNumbers(str){
        const regex = /<Id>(\d+)<\/Id>/g;
        let matches;
        const ids = [];

        while ((matches = regex.exec(str)) !== null) {
            ids.push(matches[1]); // matches[1] contains the captured group (the number)
        }

        return ids;
        }
 
    
    try {
        
        const response = await axios.get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`, { params:  term  })
        const pmids=extractNumbers(response.data);
        
        tasks[taskId].result['pmids']=pmids;
        tasks[taskId].status='completed';

        string_pmids=pmids.join(',');

        finish_time= new Date();
        tasks[taskId].run_seconds= (finish_time.getTime() - start_time.getTime())/1000;
        console.log(tasks[taskId])
        const newStatus = 'completed'
        const newResult = string_pmids;
        const run_seconds= (finish_time.getTime() - start_time.getTime())/1000;
        updateTask(taskId,newStatus,newResult,run_seconds)
        
        }catch(error) {
            console.log( error );
        };
}

//ignore
// app.post('/api/search', (req,res) => {
//     const {term} = req.body;
//     console.log('Received word:', {term});

//     function extractNumbers(str){
//         const regex = /<Id>(\d+)<\/Id>/g;
//         let matches;
//         const ids = [];

//         while ((matches = regex.exec(str)) !== null) {
//             ids.push(matches[1]); // matches[1] contains the captured group (the number)
//         }

//         return ids;
//         }
 

//     axios.get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`, { params: { term } })
//         .then(response => {
//             const pmids=extractNumbers(response.data)
//             res.json(pmids);
//         })
//         .catch(error => {
//             res.status(500).json({ error: 'Internal server error' });
//         });
// });

//ignore
// function test () {
//     const db= 'pubmed';
//     const term= 'diabetes';
//     function extractNumbers(str){
//         const regex = /<Id>(\d+)<\/Id>/g;
//         let matches;
//         const ids = [];

//         while ((matches = regex.exec(str)) !== null) {
//             ids.push(matches[1]); // matches[1] contains the captured group (the number)
//         }

//         return ids;
//         }
//     axios.get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`, { params: { db, term } })
//         .then(response => {
            
//             return extractNumbers(response.data)
//         })
//         .catch(error => {
//             console.log(error)
//         });
// }

//Create task_id for query while it runs in the background

//async (task_id, queryText, status, result, created_time, start_time, run_seconds)
app.post('/search', (req,res)=>{
    const {term} = req.body
    console.log('Received word:', {term});
    const taskId = uuidv4();
    
    // write logic to see if valid pub med term then send 
    tasks[taskId]= {
        "query":term,
        "task_id": taskId,
        "status":"processing",
        "result":{},
        "created_time": getDateTime(),
        "start_time": new Date(),
        "run_seconds": 0
        }
    
       
    const taskData={
        "query":term,
        "task_id": taskId,
        "status":"processing",
        "result":'',
        "created_time": getDateTime(),
        "start_time": new Date(),
        "run_seconds": 0
        }
    insertTask(taskData);

    const response={
        "query": {term},
        "task_id": taskId
        }
    search_term(taskId,{term},taskData['start_time'])
    res.json(response)
})



app.get('/fetch/:taskId', (req,res)=>{
    const taskId = req.params.taskId;
    console.log(req.params);
    console.log(taskId)
    fetchTaskStatus(taskId);
    const task= tasks[taskId]
    if (!task){
        return res.status(404).json({error:'task not found'})
    }
    if (task['status']=='processing'){
        res.json({
            "task_id": task['task_id'],
            "status": task['status'],
            "created_time": task['created_time']
        })
    } else if (task['status']=='completed'){
        res.json({
            "task_id": task['task_id'],
            "status": task['status'],
            "result": task['result'],
            "created_time":task['created_time'],
            "run_seconds": task['run_seconds']
        })
    
    }
});

//ignore
// app.post('/get_links', async (req,res)=>{
//     try {
//         const { uids } = req.body;
//         if (!uids || !Array.isArray(uids) || uids.length === 0) {
//           return res.status(400).json({ error: 'Invalid UIDs' });
//         }
    
//         const uidString = uids.join(',');
    
//         const response = await axios.post('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi', `id=${uidString}`, {
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           }
//         });
//         console.log(response)
//         res.status(200).json(response.data);
//       } catch (error) {
//         console.error('Error linking UIDs:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
//     });





// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


