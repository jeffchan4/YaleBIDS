# Pubmed Search
PubmedSearch is a web application that utilizes the NCBI API to fetch related articles based on user-searched terms, aiming to provide professionals with quick access to information on related topics. Due to the vast amount of data available on NCBI, the application employs a job system to run searches for related articles as background tasks. Users can check the status of these tasks, and upon completion, the application displays URLs directly to the articles. Tasks are stored using Microsoft Azure SQL.

During development, challenges included becoming familiar with the NCBI API and handling large data volumes in API responses. Additionally, setting up and configuring Azure SQL for the first time presented initial hurdles. Future plans include containerizing the application for easier deployment and accessibility, as well as deploying the web application on Azure's services.

## Requirements

React 18.3.1, Express 4.19.2 were used in creating this application.

## How to Start

### Term Search
The user will be able to input a term they would like to fetch from Pubmed database. Once submitted, the user will be provided a taskId that they can use to reference this certain task. The user can check the status of this task by clicking 'Check Task'.
If the task is completed, a list of URLS to related Pubmed articles will be displayed along with their article ID



