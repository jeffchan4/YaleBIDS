import React, { useState , useEffect} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [term,setTerm]=useState('')
  const [taskId,setTaskId]=useState('')
  const [uids,setUids]= useState([])
  const  [message, setMessage] = useState('');

  const handleSubmit = async (e)=> {
    e.preventDefault();
    try {
      
        const response = await axios.post('http://localhost:5000/search', { term });
        setTaskId(response.data.task_id)
        setMessage('Task has been queued!');
        console.log(response.data);

        setTimeout(() => {
          setMessage('');
        }, 5000);
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
        <div className="container">
          <form className="search-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Type a word"
            />
            <button type="submit">Submit</button>
          </form>
          {message && <p className="message">{message}</p>}

          <button className="check-task-button" onClick={handleTask}>Check Task</button>
    
          <div className="id-list">
            {uids.length > 0 ? (
              <ul>
                {renderListItems()}
              </ul>
            ) : (
              <p>No IDs to display.</p>
            )}
          </div>
        </div>
      );
    };

export default App;
