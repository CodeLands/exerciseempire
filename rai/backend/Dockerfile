# Base image
FROM node:20.12.2 as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's code
COPY . .

# Transpile TypeScript to JavaScript
RUN npm run build

# Final image
FROM node:20.12.2

WORKDIR /app

# Copy built artifacts from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Copy other necessary files such as environment configs if present
# COPY --from=builder /app/config ./config

# Expose the port the app runs on
EXPOSE 3000

# Command to run your app
CMD ["node", "-r", "dotenv/config", "dist/App/Server.js"]
