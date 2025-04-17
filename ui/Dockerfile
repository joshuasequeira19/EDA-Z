#eda-ui

FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code and build
COPY . .
RUN npm run build

# Use a simpler image for running the app
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy build from the previous stage
COPY --from=build /app/build ./build

# Copy server.js file from the build stage
COPY --from=build /app/server.js ./

# Install required packages for the server
RUN npm init -y && \
    npm install serve-handler http-proxy-middleware

# Expose port
EXPOSE 3000

# Serve the app on port 3000
CMD ["node", "server.js"]

