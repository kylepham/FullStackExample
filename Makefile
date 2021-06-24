setup:
	echo "Building image..."
	cd server && docker build -t api-server . && cd ..
	cd client && docker build -t react-app . && cd ..
	echo "Running docker compose..."
	docker-compose down
	docker-compose up -d

cleanup:
	docker-compose down