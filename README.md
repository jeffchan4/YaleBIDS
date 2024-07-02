# Pubmed Search
PubmedSearch is a web application that utilizes the NCBI API to fetch related articles based on user-searched terms, aiming to provide professionals with quick access to information on related topics. Due to the vast amount of data available on NCBI, the application employs a job system to run searches for related articles as background tasks. Users can check the status of these tasks, and upon completion, the application displays URLs directly to the articles. 

The application utilizes Microsoft Azure SQL to store task information in a 'tasks' table with columns including task_id (PRIMARY KEY), query, status, result, created_time, start_time, and run_seconds. Dockerfiles were instrumental in containerizing the application, streamlining deployment and accessibility.

During development, mastering the NCBI API posed challenges due to its vast data and handling large API responses effectively. Configuring Azure SQL initially required overcoming hurdles, but the setup gradually became smoother with familiarization.

Additionally, Docker posed initial challenges in terms of understanding and configuring containerization effectively. Moving forward, deploying on Azure services will leverage cloud architecture to enhance scalability and performance, alongside continued optimization of Docker usage for streamlined deployment and accessibility.

## Requirements

React 18.3.1, Express 4.19.2 were used in creating this application.

## How to Start
Run node server.js to start the backend on localhost:5000, and run npm start to start the frontend on localhost:3000.

### Term Search
The user will be able to input a term they would like to fetch from Pubmed database. Once submitted, the user will be provided a taskId that they can use to reference this certain task and the task will be stored in Azure SQL.



https://github.com/jeffchan4/YaleBIDS/assets/112337204/6e47f64d-73c1-45aa-8db1-cb185fd5a65c




### Check Task
The user can check the status of this task by clicking 'Check Task'. This reads our database from our given task_id to see the status of our task.
If the task is completed, a list of URLS to related Pubmed articles will be displayed along with their article ID.




https://github.com/jeffchan4/YaleBIDS/assets/112337204/065c4982-95f9-4e0c-8112-0556c2f0df1b


### The JSON response


![returnedjson](https://github.com/jeffchan4/YaleBIDS/assets/112337204/d3df7024-bfbe-4714-9e4d-b6db78a90175)
![returnedjson](https://github.com/jeffchan4/YaleBIDS/assets/112337204/d3df7024-bfbe-4714-9e4d-b6db78a90175)
![returnedjson](https://github.com/jeffchan4/YaleBIDS/assets/112337204/d3df7024-bfbe-4714-9e4d-b6db78a90175)

