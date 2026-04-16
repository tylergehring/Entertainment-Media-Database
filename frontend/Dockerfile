FROM node:20.20.1-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .

# Vite's default port
EXPOSE 5173

# We add --host so it's accessible outside the container
# Run npm install on every start to ensure node_modules stays in sync with package.json
CMD ["sh", "-c", "npm install && npm run dev -- --host"]