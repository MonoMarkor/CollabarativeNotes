# Real-Time Text Editor "Collabarative Notes"

This is a full-stack Angular 17 and Node.js application featuring a real-time text editor. The application runs on the same port `8080` using Express.js. It leverages CRDT (Conflict-free Replicated Data Type) data structures to avoid collisions and WebSockets for real-time communication between users. The backend uses MongoDB to store files and user information.

## Features

- **Real-Time Collaboration:** Multiple users can edit the same document simultaneously without conflicts, thanks to the CRDT data structure.
- **WebSockets Communication:** Real-time updates are communicated instantly across users through WebSockets.
- **User Authentication:** Users must create an account to use the online features of the app.
- **File Storage:** Users can save files locally or store them on the backend Cloud using MongoDB.
- **Single Port Operation:** The application runs both the client and server on the same port (`8080`) using Express.js.

## Angular Features

- **Angular Component UI Library:** Used to create a consistent and reusable user interface.
- **Pipes:** Utilized for transforming data in templates.
- **Angular Forms and Validators:** Implemented for user input and form validation.
- **Observables from RxJS Library:** Employed for managing asynchronous data streams.
- **Routing:** Configured to navigate between different views in the application.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)
- Angular CLI (ng)
- MongoDB(Database Server is running online but you can add your own at: Node-Angular_Application/dbCleints/mongodb.connect.js)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/MonoMarkor/CollabarativeNotes
   cd Node-Angular_Application/src
   node index.js
   ```

# Fontend Files Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
