FROM node:20.20.1-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .

# Vite's default port
EXPOSE 5173

# We add --host so it's accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]