import React, { useState , useEffect} from 'react';
import axios from 'axios';

function App() {
  const [term,setTerm]=useState('')
  const [taskId,setTaskId]=useState('')
  const [uids,setUids]= useState([])
  const handleSubmit = async (e)=> {
    e.preventDefault();
    try {
      
        const response = await axios.post('http://localhost:5000/search', { term });
        setTaskId(response.data.task_id)

        console.log(response.data);
    } catch (error) {
        console.error('Error submitting word:', error);
    }
};
  const handleTask = async ()  => {
    if (!taskId) {
      console.error('Task ID is not set');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/fetch/${taskId}`);
      console.log('Fetch response:', response.data);
      setUids(response.data.result['pmids']);
    } catch (error) {
      console.error('There was an error fetching the task', error);
    }
  };

  // useEffect(()=>{
  //   const fetchlinks= async () =>{

    
  //   if (uids && uids.length > 0){
  //     try{
  //     const response = await axios.post('http://localhost:5000/get_links',{uids});

  //     } catch (error) {
  //       console.error('Error with getting links:', error);
  //     }
  //   }
  // }
  // fetchlinks();
  // },[uids]);

   
      const renderListItems= () => {
        return uids.map((id,index)=>(
          
          <li key={index}>
          <a href={`https://pubmed.ncbi.nlm.nih.gov/${id}`}>PubMed ID: {id}</a>
          
          </li>
        ))
      }
  

    
  
  
    

    return (
    <div>
    <form onSubmit={handleSubmit}>
        <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Type a word"
        />
        <button type="submit">Submit</button>
    </form>
    <button onClick={handleTask}>Check Task</button>

    <div>
      {uids.length > 0 && (
        <ul>
          {renderListItems()}
        </ul>
      )}
      {uids.length === 0 && (
        <p>No IDs to display.</p>
      )}
    </div>
</div>
  );
}

export default App;
