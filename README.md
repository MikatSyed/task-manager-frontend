# Task Manager Frontend

A modern task management application built with React and Shopify Polaris UI framework.



## 🔗 Live Demo

[View Live Demo](https://task-manager-pied-iota.vercel.app/) - Replace with your actual deployed URL

## ✨ Features

- Create, read, update, and delete tasks
- Filter tasks by status (Pending, In Progress, Completed)
- Search tasks by name or description
- Sort tasks by various criteria
- Pagination with customizable items per page
- Responsive design for all devices
- Premium UI with animations and transitions
- Task priority levels and due dates

## 🛠️ Technologies Used

- React 18
- React Router v6
- Shopify Polaris UI Framework
- CSS Custom Properties
- Custom Fonts (Playfair Display & Plus Jakarta Sans)
- Jest & React Testing Library

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16
- pnpm 
- Backend API running (see [backend README](./backend-readme.md))

### Installation

1. Clone the repository:
  
   git clone <repository-url>

   cd task-manager-frontend
  

2. Install dependencies:
  

   pnpm install
 
  

3. Configure the API URL:

   - Open `src/context/TaskContext.jsx`
   - Update the `API_URL` constant to point to your backend API



   // Default is:

   const API_URL = "https://task-manager-backend-vvrqh.kinsta.app/api"



4. Start the development server:
  
   pnpm run dev
  


5. Open your browser and navigate to:
  
   http://localhost:3000
 

## 📝 Available Scripts

- `pnpm run dev` - Start the development server
- `pnpm run build` - Build the app for production
- `pnpm run preview` - Preview the production build locally



## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones




