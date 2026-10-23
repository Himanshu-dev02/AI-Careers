# syntax=docker/dockerfile:1

# ---- Stage 1: build the Vite app ----
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Vite inlines these at build time. They are public values, not secrets.
ARG VITE_SERVER=http://localhost:5000
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_RAZORPAY_KEY
ENV VITE_SERVER=$VITE_SERVER \
    VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID \
    VITE_RAZORPAY_KEY=$VITE_RAZORPAY_KEY

RUN npm run build

# ---- Stage 2: serve static files with Nginx ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
