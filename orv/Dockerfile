FROM python:3.9

# Create app directory
WORKDIR /app

# Install app dependencies
COPY faceId/requirements.txt ./

RUN pip install -r requirements.txt

# Bundle app source
COPY faceId /app

EXPOSE 4000
CMD [ "python", "integration/app/server.py" ]