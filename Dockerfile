FROM node

WORKDIR /code

COPY package.json package-lock.json /code/
RUN npm install 

COPY index.js /code/

ENV AMBIENT_API_KEY="" \
	AMBIENT_APPLICATION_KEY="" \
	AMBIENT_VERBOSE=""

CMD [ "node", "index.js" ]