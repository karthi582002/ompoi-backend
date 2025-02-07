# Use the official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the app files
COPY . .

# Expose the port (adjust if necessary)
EXPOSE 3000

CMD ["sh", "-c", "npm run db:push && npm run dev:server && npm run db:studio"]

