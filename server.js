const express = require('express');
const app = express();


const PORT = process.env.PORT || 3000;


// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

//Create task_id for query while it runs in the background
app.post('/search/:term', (req,res)=>{
    const pubmed_term = req.params.term;


    res.json({
        "records": 212111,
        "query": "alzheimer disease",
        "task_id": "7fd381bf3cbe28e892e163db81b9e2cd"
        })
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});