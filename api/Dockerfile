#eda-api

# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
# If you haven't created a requirements.txt, you can do so with the Python command: pip freeze > requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV FLASK_APP=main.py
ENV FLASK_RUN_HOST=0.0.0.0

# Change this

ENV CLOUD_API="https://123.execute-api.us-east-1.amazonaws.com" 

# Run app.py when the container launches
CMD ["flask", "run"]
