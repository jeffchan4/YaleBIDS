import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [term,setTerm]=useState('')
  const handleSubmit = async (e)=> {
    e.preventDefault();
    try {
      
        const response = await axios.post('http://localhost:5000/api/search', { term });
        console.log(response.data);
    } catch (error) {
        console.error('Error submitting word:', error);
    }
};
  

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
</div>
  );
}

export default App;
