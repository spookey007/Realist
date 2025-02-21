# Realist

## Description

This project is a web application built using **Vite** and **React** for the frontend, with a **Node.js** server as the backend.

## Tech Stack

- **Frontend:** Vite + React
- **Backend:** Node.js + Express
- **Database:** PostgreSQL with Sequelize ORM

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/galicouser/mmt.git
   cd mmt
   npm install
   
   for development localhost:
   npm run dev

   for production live
   npm run build
   npm run start

   make sure you have .env file locally configured on defined on production
   
2. Configure and install PostgreSQL

    npx sequelize-cli model:generate --name Appointment --attributes name:string,email:string,phone:string,message:text,dateTime:date,status:integer
    npx sequelize-cli model:generate --name Contact --attributes name:string,email:string,phone:string,message:text

    npx sequelize-cli db:migrate

# realist_react
