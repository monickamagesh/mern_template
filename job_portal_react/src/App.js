import './App.css';
import React, { useRef, useState } from 'react';

function App() {
  const [jobList, setJobList] = useState([]); // Initialize jobList as an empty array
  const [id,setId] = useState([]);
  const nameRef = useRef();
  const cnameRef = useRef();
  const rnameRef = useRef();

  const createJob = async () => {
    let data = {
      "name": nameRef.current.value,
      "company_name": cnameRef.current.value,
      "requirements": rnameRef.current.value,
    };
    let res = await fetch("http://localhost:8080/createJob", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" }
    });
    let json = await res.json();
    console.log(json);
    getData(); // Refresh the job list after creating a job
  };

  const getData = async () => {
    let res = await fetch("http://localhost:8080/listJob", { method: "GET" });
    let json = await res.json();
    console.log(json);
    setJobList(json);
  };

  const deleteJob = async (id) => {
    let res = await fetch("http://localhost:8080/delete?id=" + id, { method: "DELETE" });
    if (res.ok) {
      alert("Job deleted");
      getData(); 
    } else {
      alert("Error while deleting");
    }
  }

  const loadDataForUpdate = (id) => {
    let matchJob = jobList.filter((j)=>id==j._id)
    console.log(matchJob)
    setId(id)
    nameRef.current.value = matchJob[0].name;
    cnameRef.current.value = matchJob[1].company_name;
    rnameRef.current.value = matchJob[2].requirements;
  }

  const updateJob = async ()=>{
    let data = {
      "_id": id,
      "name": nameRef.current.value,
      "company_name": cnameRef.current.value,
      "requirements": rnameRef.current.value,
    };
    let res = await fetch("http://localhost:8080/updateJob", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" }
    });
    let json = await res.json();
    console.log(json);
    getData(); 
  }
  
  return (
    <div className="App">
      <div>
      {jobList.map((obj,index) => (
          <div key={index}>
            <h1>{obj.name}</h1>
            <p>Company: {obj.company_name}</p>
            <p>Requirement: {obj.requirements}</p>

            <button onClick={() => deleteJob(obj._id)}>Delete</button>
            <button onClick={() => loadDataForUpdate(obj._id)}>Update</button>
          </div>
        ))}
      </div>
      <div><button onClick={getData}>Get Job List</button></div>
      <div>
        <h1>Create Jobs Form</h1>
        <div><input type="text" ref={nameRef} placeholder="Name"></input></div>
        <div><input type="text" ref={cnameRef} placeholder="Company Name"></input></div>
        <div><input type="text" ref={rnameRef} placeholder="Requirements"></input></div>
        <div><button onClick={createJob}>Submit</button></div>
        <div><button onClick={updateJob}>Update Job</button></div>
      </div>
    </div>
  );
}

export default App;
