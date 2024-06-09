# Base image
FROM node:20.12.2 as builder

# Set the working directory in the Docker container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your frontend code into the Docker container
COPY ./ .

# Build the frontend
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:latest

# Copy built assets from builder stage to Nginx server
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 to the outside once the container has launched
EXPOSE 80

# Start Nginx and keep it running in the foreground
CMD ["nginx", "-g", "daemon off;"]