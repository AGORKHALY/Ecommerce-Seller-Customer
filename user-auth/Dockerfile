# Step 1: Use official Node.js image to build the React app
FROM node:18 AS build

# Step 2: Set the working directory
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the React app files
COPY . .

# Step 6: Build the React app
RUN npm run build

# Step 7: Use Nginx to serve the production build
FROM nginx:alpine

# Step 8: Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Step 9: Copy the build directory to Nginx's public folder
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Step 10: Expose port 80 for Nginx
EXPOSE 80

# Step 11: Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
