# Build Docker image
build:
	docker build -t air-quality-api .

# Run Docker container
run:
	docker run -p 3000:3000 --name air-quality-container air-quality-api

# Stop and remove Docker container
stop:
	docker stop air-quality-container
	docker rm air-quality-container

# Remove Docker image
clean:
	docker rmi air-quality-api
