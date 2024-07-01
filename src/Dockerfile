# Use an official Node.js image as the base image for frontend build
FROM node:14 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json from root directory
COPY ../package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend application code
COPY . .

# Build the frontend app
RUN npm run build

# Use Nginx to serve the built frontend app
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
