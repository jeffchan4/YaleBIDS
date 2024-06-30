const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

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



const search_term= async (taskId,term) => {
    

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

        finish_time= Date.now()
        tasks[taskId].run_seconds= (finish_time - tasks[taskId].start_time)/1000;
        console.log(tasks[taskId])
            
        }catch(error) {
            console.log( error );
        };
}


app.post('/api/search', (req,res) => {
    const {term} = req.body;
    console.log('Received word:', {term});

    function extractNumbers(str){
        const regex = /<Id>(\d+)<\/Id>/g;
        let matches;
        const ids = [];

        while ((matches = regex.exec(str)) !== null) {
            ids.push(matches[1]); // matches[1] contains the captured group (the number)
        }

        return ids;
        }
 

    axios.get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`, { params: { term } })
        .then(response => {
            const pmids=extractNumbers(response.data)
            res.json(pmids);
        })
        .catch(error => {
            res.status(500).json({ error: 'Internal server error' });
        });
});


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

app.post('/search', (req,res)=>{
    const {term} = req.body
    console.log('Received word:', {term});
    const taskId = uuidv4();

    //write logic to see if valid pub med term then send 
    tasks[taskId]= {
        "query":{term},
        "task_id": taskId,
        "status":"processing",
        "result":{},
        "created_time": getDateTime(),
        "start_time": Date.now(),
        "run_seconds": 0
        }
    const response={
        "query": {term},
        "task_id": taskId
        }
    search_term(taskId,{term})
    res.json(response)
})



app.get('/fetch/:taskId', (req,res)=>{
    const taskId = req.params.taskId;
    console.log(req.params);
    console.log(taskId)
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



