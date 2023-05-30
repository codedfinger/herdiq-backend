# Build stage
FROM node:14 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the app source code to the container
COPY . .


# Runtime stage
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY --from=build /app ./

# Expose port 5000
EXPOSE 5000

# Start the Node.js app
CMD ["npm", "start"]
