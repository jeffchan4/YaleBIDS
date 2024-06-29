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



const search_term= async (taskId) => {
    

    return new Promise ((resolve)=>{
        finish_time= Date.now()
        tasks[taskId].status='completed';
        tasks[taskId].run_seconds= finish_time - tasks[taskId].start_time;
        resolve();
    })
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
            console.log(response.data)
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

app.post('/search/:term', (req,res)=>{
    const pubmed_term = req.params.term;
    
    //write logic to see if valid pub med term then send 
    response={
        "records": 212111,
        "query": "alzheimer disease",
        "task_id": "7fd381bf3cbe28e892e163db81b9e2cd"
        }
    tasks[response['task_id']]= {
        "task_id": response['task_id'],
        "status":"processing",
        "result":{},
        "created_time": getDateTime(),
        "start_time": Date.now(),
        "run_seconds": 0
        }
    search_term(response['task_id'])
    res.json(response)
})

app.get('/fetch/:task_id', (req,res)=>{
    const task_id = req.params.task_id;
    const task= tasks[task_id]
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
            "result":{
            "pmids":[7952237,37506310,32397415]
            },
            "created_time":task['created_time'],
            "run_seconds": task['run_seconds']
        })
    
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



