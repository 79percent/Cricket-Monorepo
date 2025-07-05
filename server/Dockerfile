FROM node:12-slim

COPY . /home/cricket-api

WORKDIR /home/cricket-api

RUN npm install -g pm2
# RUN apt-get update
# RUN apt-get install vim

EXPOSE 4000 5000

VOLUME [ "/home/cricket-api" ]

# CMD npx pm2 start npm --name "cricket-api" -- run prd
# CMD [ "npx", "pm2", "start", "npm", "--name", "cricket-api", "--", "run", "prd" ]

# docker build -f ./DockerFile  -t cricket-node:1.0 .

# docker run --name cricket-node -p 4000:4000 -p 5000:5000 -itd --net cricket-net -v /home/cricket-api:/home/cricket-api cricket-node:1.0

# docker exec -it  cricket-node /bin/bash

# docker run --name cricket-mongo -p 27017:27017 --net cricket-net -e MONGO_INITDB_ROOT_USERNAME=cricket_admin -e MONGO_INITDB_ROOT_PASSWORD=cricket_666 -v /home/mongo/data:/data/db -itd mongo