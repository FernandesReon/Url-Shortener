# Url Shortener

A modern URL shortening service that transforms long, messy, and unprofessional web addresses into short, clean, and 
professional links that are easy to share and look great. Built with Spring Boot, React.js, and MySQL, this application 
uses JWT-based authentication for security and is containerized with Docker for simple deployment and scalability.

## Table of Contents
- [What it does](#what-it-does)
- [Features](#features)
- [Technologies Used](#technologies-used)

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

