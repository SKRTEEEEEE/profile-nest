#!/bin/bash

# Script to run tests in Docker and generate coverage reports

echo "🐳 Building Docker test image..."
docker-compose -f docker-compose.test.yml build

echo "🧪 Running tests with coverage..."
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

echo "✅ Tests completed! Check coverage report in ./coverage/unit"

# Clean up
docker-compose -f docker-compose.test.yml down
