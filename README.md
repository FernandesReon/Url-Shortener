# Url Shortener

A modern URL shortening service that transforms long, messy, and unprofessional web addresses into short, clean, and 
professional links that are easy to share and look great. Built with Spring Boot, React.js, and MySQL, this application 
uses JWT-based authentication for security and is containerized with Docker for simple deployment and scalability.

## Table of Contents
- [What it does](#what-it-does)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)

## What it does?
Imagine you have a long web address that's hard to share because it's filled with random letters and numbers. 
This **URL shortener** is like a magic tool that turns that messy link into a short, neat one like **short.link/abc123**. 
It makes your links look professional and easy to share on social media, emails, or anywhere else. 
When someone clicks the short link, they’re taken straight to the original webpage. 
It’s secure, user-friendly, and works on any device, with features to keep your links safe and organized.

## Features
- Converts long URLs into short, professional-looking links.
- Secure user accounts with JWT authentication. (authorized people can create short links).
- Stores all links and user data safely in a MySQL database.
- Clean, responsive interface built with React.js for a great user experience. 
- Easy deployment with Docker, making it simple to run anywhere. 
- RESTful API for creating and accessing short links. 
- Planned support for OAuth 2.0 to log in with services like Google or GitHub.

## Technologies used
- **Backend**: Spring Boot, Spring Security(JWT for authentication)
- **Frontend**: React.js, Tailwind CSS(for styling)
- **Database & Caching**: MySQL and Redis
- **Containerization**: Docker
- **Tools**: Maven(backend build), Axios(frontend HTTP requests)

## Prerequisites
To run this project, you'll need:
- Java 17 or higher
- Node.js 22 or higher
- MySQL 8.0 or higher
- Docker
- Maven (for building the backend)

## Setup Instructions
1. Clone the Repository
    - Download the project code to your computer:
    ```bash
   git clone https://github.com/FernandesReon/url-shortener.git
   cd url-shortener
   ```
2. Backend Setup (Spring Boot)
   - Go to the backend folder
    ```bash
   cd backend
   ```
   - Create a MySQL database:
   ```bash
    CREATE DATABASE url_shortener;
   ```
   - Set up MySQL in the configuration file: src/main/resource/application.properties
   ```bash
    spring.datasource.url=jdbc:mysql://localhost:3306/url_shortener
    spring.datasource.username=your_username
    spring.datasource.password=your_password
    spring.jpa.hibernate.ddl-auto=update
   ```
   - Build and start the backend
   ```bash 
   mvn spring-boot:run
   ```
3. Frontend Setup (React.js)
    - Go to the frontend folder:
   ```bash
   cd frontend
    ```
   - Install the required packages:
   ```bash
   npm install
   ```
   - Run the project:
   ```bash
   npm run dev
   ```