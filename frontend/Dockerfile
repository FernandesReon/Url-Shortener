# Step 1: Use Node.js 22 Alpine (small image) to build React/Vite app
FROM node:22-alpine AS build

# Set working directory inside container
WORKDIR /app

# Copy only dependency files (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Build the app (creates /app/dist for Vite, /app/build for CRA)
RUN npm run build

# Step 2: Use lightweight Nginx to serve the static files
FROM nginx:alpine

# Copy the build output from the "build" stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config for React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 inside container
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
