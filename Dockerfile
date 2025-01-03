# Use official Node.js image as a base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) for npm install
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Prisma CLI
RUN npm install -g prisma

# Copy the rest of the application files
COPY . .

# Generate the Prisma Client
RUN npx prisma generate

# Expose the application port
EXPOSE 4000

# Run the application
CMD ["npm", "run", "dev"]
