# todoplus
[![Generic badge](https://img.shields.io/badge/npm-v14.16.1-blue.svg)](https://shields.io/) [![Generic badge](https://img.shields.io/badge/node-6.14.12-green.svg)](https://shields.io/)
![logo](/src/assets/image/todoplus-logo.png)

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [RESTful API Endpoints](#restful-api-endpoints)
* [Setup](#setup)

## General info
TodoPlus is a shared to-do list app built with Node.js and PostgreSQL that uses the ExpressJS Framework and Sequelize ORM. It is a to-do list app that allows users to share goals and tasks with each other. Users can add friends and receive notifications when a task is about to reach its deadline (30 minutes before). The app helps users stay organized and on track with their tasks, allowing them to collaborate and achieve their goals together.
### Architecture Diagram of TodoPlus
![architecture-diagram](/src/assets/image/architecture-diagram.png)

This architecture provides a scalable and reliable way for the Client to access data and business logic through the API Gateway, using EC2 instances and RDS as the backend services. The Node.js application, Nginx, and PM2 work together to serve the application's needs and ensure smooth operation.

* **Client:** The end user or application that interacts with the API, Client interacts with the API Gateway to access data and business logic from the backend services. 
* **EC2 Instances:** The backend services are hosted on EC2 instances The EC2 instances run a Node.js application, which is managed and served by Nginx and PM2 respectively. Nginx serves as the web server for the Node.js application, handling incoming HTTP requests and serving the appropriate responses. PM2 is a process manager that ensures the Node.js application is running smoothly and automatically restarts the application if it crashes or if the EC2 instance is restarted.
* **RDS Database:** The backend services communicate with the RDS database to store and retrieve data. The RDS database stores all the persistent data for the application and is accessed by the EC2 instances as needed. The relational database used on this RDS is PostgreSQL. PostgreSQL is an advanced, enterprise-class, and open-source relational database system. PostgreSQL supports both SQL and JSON querying.


### ERD of TodoPlus 
![erd](/src/assets/image/erd.png)

The todoplus ERD consists of tables for Users, Profiles, Relationships, Goals, Tasks, and Notifications. 

* **Users:** This table contains information about each user, such as their name, email, and password.
* **Profiles:** This table contains information about the profiles of each user, such as their username, date of birth, and other personal information. Each user can have only one profile.
* **Relationship:** This table manages the many-to-many relationship between users and users. It contains information about the users who are following or are followed by another user.
* **Goals:** This table contains information about each goal, such as its owner, description, and title. Users can have many goals, and vice versa. A goal can have multiple tasks.
* **Tasks:** This table contains information about each task, such as its tite, deadle, and status. A task belongs to a single goal.
* **Notification:** This table contains information about task notification, A user can have multiple notifications.


## Technologies
Project is created with:
* node : 14.16.1
* express : 4.18.2
* sequelize : 6.27.0
* pg : 8.8.0
* jest : 29.4.1

## RESTful API Endpoints
### API Endpoints
RESTful API Endpoints are shown in the table below:
### Auth Endpoint
| Method | Endpoint | Description |
| --- | --- | --- | 
| POST | `/api/auth/register` | Register a new user | 
| POST | `/api/auth/login` | Log in an existing user |
| POST | `/api/auth/logout` | Log out an existing user. |
| POST | `/api/auth/refreshToken` | Refresh an existing user's session token |
### Profile Endpoint
| Method | Endpoint | Description |
| --- | --- | --- | 
| POST | `/api/profile`| Add a new profile |
| GET | `/api/profile/{userId}`| View a profile |
| PUT | `/api/profile/{userId}`| Update a profile |
| GET | `/api/profile/{userId}/goals?goal={query}`| View a user goals |
| GET | `/api/profile/{userId}/goals/{goalId}`| View the detail of user's goals |
| GET | `/api/profile/{userId}/followings`| View the followings of a user |
| GET | `/api/profile/{userId}/followers`| View the followers of a user |
| GET | `/api/profile/{userId}/notifications`| View notifications for a user |
| POST | `/api/profile/{userId}/notifications`| Mark the notification as read |
### Goal Endpoint
| Method | Endpoint | Description |
| --- | --- | --- | 
| POST | `/api/goals`| Add a new goal |
| POST | `/api/goalsMember`| Add a new goal member |
| PUT | `/api/goals/{goalId}`| Update a goal |
| DELETE | `/api/goals/{goalId}`| Delete a goal |
### Task Endpoint
| Method | Endpoint | Description |
| --- | --- | --- | 
| POST | `/api/goals/{goalId}/task`| Add a new task |
| PUT | `/api/goals/{goalId}/task/{taskId}`| Update a task |
| DELETE | `/api/goals/{goalId}/task/{taskId}`| Delete a task |
### Relationship Endpoint
| Method | Endpoint | Description |
| --- | --- | --- | 
| GET | `/api/friends`| View list of users |
| POST | `/api/friends`| Follow user as friend |
| DELETE | `/api/friends`| Unfollow user |


### Postman Collection
You can test this API by using the postman application. Please [**Click here**](https://github.com/androsyahreza/todoplus/tree/main/src/assets/postman-collection) to view the postman collection that was created for this application.

## Setup
To run this project, install it locally using npm:
```
$ cd todoplus
$ npm install
$ npm start
```
