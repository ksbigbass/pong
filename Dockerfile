# Simple Dockerfile for a static Pong game (HTML/CSS/JS)

# Use nginx to serve static files
FROM nginx:alpine

# Copy static files to nginx html directory
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY pong.js /usr/share/nginx/html/pong.js

# Expose port 80
EXPOSE 80

# No CMD needed; nginx default is to run