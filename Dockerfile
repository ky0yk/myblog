FROM node:18

WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./
RUN npm install && npm cache clean --force

# build bcrypt in docker
RUN npm rebuild bcrypt --build-from-source

COPY . .

# Generate prisma client
RUN npx prisma generate

RUN npm run build

# Make our wait script executable
RUN chmod +x /usr/src/app/scripts/wait-for-db.sh

EXPOSE 3000

# Start application with the wait script
CMD [ "/usr/src/app/scripts/wait-for-db.sh", "db", "node", "dist/server.js" ]
