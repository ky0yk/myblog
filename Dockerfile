FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Make our wait script executable
RUN chmod +x /usr/src/app/scripts/wait-for-db.sh

EXPOSE 3000

# Start application with the wait script
CMD [ "/usr/src/app/scripts/wait-for-db.sh", "db", "node", "dist/server.js" ]
