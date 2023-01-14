# Use an official Python runtime as the base image
# FROM python:3.8-alpine
FROM python:3.8

# Set the working directory in the container
WORKDIR /code

# Copy the requirements file into the container
COPY requirements.txt /code/

# Set enviroment variables about the app name and host
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

#Upgrade pip
RUN pip install --upgrade pip

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code into the container
COPY . /code/

# Expose the port for the application to run on
EXPOSE 5000

# Define the command to run the application
CMD ["flask", "run"]