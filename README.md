ProjectFlow
ProjectFlow is a project management frontend built with React, TypeScript, and Vite. It organizes project work into Projects, Features, Functions, and Product Backlog Items (PBIs).
Features
Project detail page and overview dashboard
Feature management with create, edit, and delete operations
Function management under Features
PBI management under Functions
PBI fields include status, priority, story points, and acceptance criteria
Local browser storage (`localStorage`) for the current frontend data
Responsive UI using Bootstrap
Icons with Lucide React
Charts and data visualization support with Recharts
> Note: The current frontend stores its working data in browser `localStorage`. This README does not imply that a backend database or API has been connected.
Tech Stack
Main dependencies
Package	Purpose
`react`	Build user interfaces
`react-dom`	Render React applications in the browser
`react-router-dom`	Client-side routing
`lucide-react`	UI icons
`recharts`	Charts and data visualization
The project also uses TypeScript and Vite for development/build tooling. Check `package.json` for the complete dependency list and installed versions.
Prerequisites
Node.js (an LTS version is recommended)
npm (included with Node.js)
Git (if cloning or pulling the repository)
Getting Started
1. Get the source code
For a first-time setup, clone the repository:
```bash
git clone <repository-url>
cd <repository-folder>
```
Replace the placeholders with your actual repository URL and folder name.
If you already have the repository locally, open a terminal in the project folder and pull the latest code:
```bash
git pull
```
Commit or back up local changes before pulling.
2. Install dependencies
For a new setup, run:
```bash
npm install
```
If `package-lock.json` is committed and you want a clean install that follows the lockfile, you can use:
```bash
npm ci
```
Use either command for a given setup. `npm ci` requires a compatible `package-lock.json` and replaces the existing `node_modules` folder.
3. Start the development server
```bash
npm run dev
```
Open the local URL printed in the terminal. Vite commonly uses `http://localhost:5173`, but use the URL shown by your terminal.
Available Scripts
Verify the `scripts` section in `package.json` for the exact commands configured in your repository.
Command	Purpose
`npm run dev`	Start the development server
`npm run build`	Build the production bundle, if configured
`npm run preview`	Preview a production build, if configured
Project Structure
This is a simplified overview based on the files used during development. Your repository may contain additional files or different filenames.
```text
src/
├── assets/
│   ├── pages/
│   │   └── ProjectDetail.tsx
│   ├── types/
│   │   ├── project.ts
│   │   └── projectFunctional.ts
│   └── utility/
│       ├── projectFeatureList.ts
│       ├── projectFunctionList.ts
│       ├── processTab.ts
│       └── user.ts
└── components/
    ├── functions/
    │   ├── FunctionList.tsx
    │   ├── FunctionCard.tsx
    │   └── FunctionModal.tsx
    └── pbis/
        └── PBIsList.tsx
```
Use the actual project tree as the source of truth if your filenames differ.
Data Model
The current work hierarchy is:
```text
Project
└── Feature
    └── Function
        └── PBI
```
A PBI supports:
Title and detail
Owner
Status: `Not Started`, `In Progress`, `Completed`, `On Hold`
Priority: `Low`, `Medium`, `High`, `Critical`
Story points
Acceptance criteria
Optional sprint reference (`sprintId`)
Data Storage
The current frontend uses browser `localStorage` for Features, Functions, and PBIs. Data is stored in the browser profile used to run the app, so it is not automatically shared between different browsers or computers.
Current storage keys include:
`feature`
`functions`
`pbis`
Clearing browser storage may remove locally saved data. A backend/database integration would be needed for shared, centralized storage.
Development Workflow
Pull the latest source code.
Install dependencies for a new setup or when dependencies change.
Run `npm run dev`.
Test the screens affected by your changes.
Run the configured build command before committing, if available.
Commit and push your changes to Git.
Troubleshooting
`npm` is not recognized
Install Node.js, then close and reopen the terminal. Check the installation:
```bash
node --version
npm --version
```
A dependency cannot be found
From the project root, run:
```bash
npm install
```
Confirm that the package is listed in `package.json`.
The development server does not start
Confirm that the terminal is in the folder containing `package.json`.
Review the full terminal error.
Check the scripts configured in `package.json`.
Stop the server with `Ctrl+C` and run `npm run dev` again if needed.
License
Add the project's license and usage terms here when they have been decided.
