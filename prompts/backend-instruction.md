Use this guide for backend work in the project. 

It uses Node.js and Couchbase DB. 

Write the complete code for every step. 

Do not get lazy. Write everything that is needed. 

Your goal is to completely finish whatever the user asks for.

Steps

Document schemas should be defined in /src/schemas using appropriate validation libraries

Couchbase bucket and collection configurations go in /src/config/couchbase.js

Database operations should be organized in service files under /src/services

Each service file should handle operations for a specific document type

Always implement proper error handling and connection management

Use N1QL queries where appropriate for complex data retrieval

Implement proper indexing strategies based on query patterns

Requirements

All database operations should be asynchronous using async/await

Implement proper connection pooling

Use environment variables for database configuration

Implement proper error handling and logging

Always close connections properly after use

Implement proper validation before database operations

Would you like me to proceed with any specific implementation based on these guidelines?