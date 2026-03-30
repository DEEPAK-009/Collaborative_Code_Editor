# Collaborative Code Editor

A full-stack real-time collaborative coding platform where multiple users can join the same room, write code together, 
chat live, see participant activity, and execute code securely inside Docker containers.

This project is built as a complete collaborative workspace rather than just a text editor. It combines authentication, 
room-based access control, synchronized code editing, persistent chat, participant management, and multi-language code execution
into one web application.

## Tech Stack

### Frontend
- React
- React Router
- Axios
- Socket.IO Client
- Monaco Editor
- CSS

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- Socket.IO
- Passport Google OAuth
- JWT
- bcrypt
- Docker

  
## Overview

The main goal of this project is to provide a shared coding environment where users can collaborate in real time from different devices or browser tabs. Each room acts like a live coding workspace with role-based permissions.

Users can:
- create and join collaboration rooms
- log in with email/password or Google OAuth
- collaborate on code in real time
- chat with other participants instantly
- manage room members and roles
- execute code securely in isolated Docker containers
- reconnect to rooms without losing room state

The application follows a clean backend structure:

`Route -> Controller -> Service -> Model`

This separation keeps the codebase maintainable and easier to scale.


## Core Features

## 1. Authentication System

The project supports a complete authentication flow with:
- email signup and login using hashed passwords with `bcrypt`
- JWT-based authentication for protected API access
- Google OAuth login using Passport
- linked authentication providers for the same account

### How it works
When a user signs up or logs in, the backend generates a JWT token. The frontend stores that session per tab and attaches the token to API requests and Socket.IO connections. Protected routes only allow authenticated users.

This system supports:
- email-first users who later add Google login
- Google-first users who later set a password
- secure user session handling
- protected room and execution actions

## 2. JWT-Protected API and Socket Authentication

Authentication is not limited to HTTP routes. Socket connections are also protected using JWT.

### How it works
When the frontend connects to Socket.IO, it sends the JWT token in the socket auth payload. The backend verifies that token before allowing the user to join or interact with any room events.

This ensures that:
- only valid users can connect to room sockets
- room events are tied to real authenticated users
- unauthorized users cannot send code, chat, or participant actions

## 3. Room System with Role-Based Access

The room system is the heart of the application.

Each room has:
- a unique room ID
- an owner
- members list
- room code state
- language state

Supported roles:
- `owner`
- `editor`
- `viewer`

### What each role can do
- Owner:
  - full room control
  - change user roles
  - remove users
  - transfer ownership
- Editor:
  - edit code
  - send cursor updates
  - run code
  - chat
- Viewer:
  - view code and room activity
  - chat
  - cannot edit code

### How ownership works
When the owner leaves the room, ownership is automatically transferred to another suitable participant. If the room becomes empty, it is deleted automatically.

This makes the room lifecycle reliable and prevents abandoned room states.


## 4. Real-Time Code Synchronization

The editor supports live collaborative editing using Socket.IO.

### How it works
Whenever an editor types, code changes are emitted through the socket and broadcast to everyone else in the room. The latest code is also saved in the database so room state persists across refreshes and reconnects.

This means:
- all participants see near-instant code updates
- the latest room code is preserved
- refresh and reconnect restore the latest synchronized state


## 5. Monaco Editor Integration

The frontend uses Monaco Editor to provide a professional coding experience.

### Features
- syntax-aware code editing
- multiple supported languages
- read-only mode for viewers
- live collaborative updates
- cursor tracking support

This gives the app a real IDE-like feel instead of a plain text area.


## 6. Live Cursor System

The application supports real-time remote cursor updates.

### How it works
Only users with edit permission send cursor movement events. Other users receive those updates and see remote cursor markers inside the editor.

Additional behavior:
- cursor updates are throttled
- cursor markers are removed when users disconnect
- viewers remain read-only but can still observe room activity

This improves collaboration by showing where others are currently working.


## 7. Real-Time Chat with Persistence

Each room includes an integrated live chat panel.

### How it works
Messages are sent through Socket.IO for real-time delivery and are also stored in MongoDB. When a user joins a room, the recent chat history is loaded automatically.

This gives you:
- instant room conversation
- persistent chat history
- synchronized communication inside the same workspace


## 8. Participant Management Panel

The editor includes a participant panel that displays all room members and their roles.

### Owner controls
The owner can open a menu for each participant and:
- change their role
- transfer ownership
- remove them from the room

### Presence behavior
The app tracks active room presence in real time. Users are added and removed based on actual room connection state, and short join/leave popups are shown inside the editor for quick awareness.


## 9. Secure Code Execution with Docker

One of the biggest features of the project is secure server-side code execution.

Supported languages:
- JavaScript
- Python
- C++
- Java
- Go
- Rust

### How it works
When a user runs code:
- the current code is sent to the backend
- the backend writes it into a temporary file
- the code is executed inside a Docker container
- the output is captured and returned to the room

### Security controls
Execution runs with limits such as:
- memory restriction
- CPU restriction
- disabled network access
- temporary isolated working directories

This prevents unsafe execution from directly affecting the host system.


## 10. Execution Output Panel

The editor includes a dedicated output panel.

### What it does
- shows execution results
- shows runtime errors
- updates after every run
- keeps output in the same workspace so users do not need to switch context

This makes the app feel more like a collaborative online IDE.


## 11. Rate Limiting for Code Execution

To prevent abuse, code execution is rate-limited.

### Current behavior
A user can run code only a limited number of times in a short time window. This protects the server from spam execution requests and makes the execution system safer in shared environments.


## 12. Reconnection and Refresh Handling

The project includes reconnect-aware room behavior.

### How it works
If a user refreshes or reconnects:
- the room state is restored
- the latest code is reloaded
- chat history is reloaded
- real-time socket participation is resumed

This was implemented to make collaboration feel stable even when a tab reload happens.


## 13. Dashboard and App Flow

The frontend is organized into a clean user flow:

### Home Page
The landing page introduces the app and directs users to login or signup.

### Login / Signup Pages
Users can authenticate using:
- email and password
- Google OAuth

### Dashboard
After login, users can:
- create a new room
- join an existing room
- update display name
- update password
- sign out

### Editor Page
The editor page combines:
- Monaco editor
- participants panel
- chat panel
- output panel
- room header with actions and language/run controls


## 14. Session Handling Per Tab

The frontend uses tab-scoped session storage for authentication.

### Why this matters
This allows different browser tabs to be logged in as different users at the same time, which is especially useful for testing collaboration locally.

That means:
- one tab can be one user
- another tab can be another user
- sessions do not overwrite each other across tabs


## 15. UI and Collaboration Experience

The project is designed to feel like a real collaborative product rather than a rough prototype.

### UX details include
- protected routes
- clean authentication flow
- confirmation prompts for important actions
- centered auth layout
- join/leave room notifications
- role-based controls
- single-page editor layout with fixed panels
- real-time updates across code, chat, participants, and output



## High-Level Working Flow

1. A user logs in using email/password or Google.
2. The backend returns a JWT token.
3. The frontend stores the session and uses the token for API and socket auth.
4. The user creates or joins a room from the dashboard.
5. The editor loads room state, members, code, and chat history.
6. Socket.IO keeps code, chat, cursors, and participant state synchronized live.
7. Owners manage users and roles through the participant panel.
8. Editors can run code, and the backend executes it inside Docker.
9. Output is returned and displayed in the editor for everyone in the room.



## Conclusion

This collaborative code editor is a complete real-time web application designed for multi-user coding sessions. It solves real collaboration problems by combining secure authentication, room-based workflows, synchronized editing, live chat, participant controls, and multi-language Docker execution in one unified platform.
