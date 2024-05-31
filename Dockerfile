
    # Use the official Node.js image as the base image
    FROM node:14
    
    # Create and set the working directory
    WORKDIR /usr/src/app
    
    # Copy package.json and package-lock.json files
    COPY package*.json ./
    
    # Install the dependencies
    RUN npm install
    
    # Copy the rest of the application code to the working directory
    COPY . .
    
    # Expose the port that your app runs on
    EXPOSE 3000
    
    # Specify the command to run your application
    CMD ["npm", "run", "dev"]