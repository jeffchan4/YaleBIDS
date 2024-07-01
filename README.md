# PubmedSear
PubmedSearch is a web application that utilizes the NCBI API to fetch related articles based on user-searched terms, aiming to provide professionals with quick access to information on related topics. Due to the vast amount of data available on NCBI, the application employs a job system to run searches for related articles as background tasks. Users can check the status of these tasks, and upon completion, the application displays URLs directly to the articles. Tasks are stored using Microsoft Azure SQL.

During development, challenges included becoming familiar with the NCBI API and handling large data volumes in API responses. Additionally, setting up and configuring Azure SQL for the first time presented initial hurdles. Future plans include containerizing the application for easier deployment and accessibility, as well as deploying the web application on Azure's services.

## Requirements

React 18.3.1, Express 4.19.2 were used in creating this application.

## How to Start

### Term Search
