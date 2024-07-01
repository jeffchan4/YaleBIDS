# Use a more recent Node.js image as the base image for backend
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies for both backend and frontend
RUN npm install

# Copy the rest of the backend application code
COPY . .

# Expose the port the backend app runs on
EXPOSE 5000

# Command to run the backend app
CMD ["node", "server.js"]
