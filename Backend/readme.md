📁 config
Purpose: Configuration files for external services.
Examples:
    Database connection
    Environment configs
Example in your project:
    config/db.js → connects to MongoDB

📁 controllers
Purpose: Handles incoming requests and responses.
    receive request from routes
    call service functions
    send response back

📁 models
Purpose: Defines database schemas.
Used to interact with MongoDB through Mongoose.

📁 routes
Purpose: Defines API endpoints.
Maps URL → controller.

📁 services
Purpose: Contains business logic.
Controllers stay clean by moving logic here.

📁 sockets
Purpose: Handles real-time communication (WebSockets).
For your project this will manage:
users joining rooms
real-time code syncing
broadcasting updates

📁 utils
Purpose: Helper functions used across the project.
Examples:
    ID generators
    validation
    error handlers

📄 app.js
Purpose: Express app configuration.
Contains:
    middleware
    routes
    JSON parsing

📄 server.js
Purpose: Starts the actual server.
Responsibilities:
    load environment variables
    connect database
    start server
    attach socket.io


🔄 Full Request Flow (important)
Client request
      ↓
Routes
      ↓
Controller
      ↓
Service
      ↓
Model (Database)


1️⃣ What a Socket Is
A socket is a persistent connection between the client (browser) and the server.
Unlike HTTP:
    HTTP → request → response → connection closes
    Socket → connection stays open
This allows real-time communication.