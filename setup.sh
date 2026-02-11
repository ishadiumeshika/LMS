#!/bin/bash

# LMS Setup and Start Script for Unix/Linux/macOS
echo "========================================"
echo "LMS - Learning Management System Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${YELLOW}Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed!${NC}"
    echo -e "${RED}Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}Node.js version: $NODE_VERSION${NC}"

# Install Backend Dependencies
echo ""
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend || exit 1
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Error installing backend dependencies!${NC}"
    exit 1
fi
echo -e "${GREEN}Backend dependencies installed successfully!${NC}"

# Create Admin User
echo ""
echo -e "${YELLOW}Creating admin user...${NC}"
node createAdmin.js
echo ""

# Go back to root and install Frontend Dependencies
cd ..
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd frontend || exit 1
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Error installing frontend dependencies!${NC}"
    exit 1
fi
echo -e "${GREEN}Frontend dependencies installed successfully!${NC}"

# Go back to root
cd ..

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${YELLOW}To start the application:${NC}"
echo -e "1. Open a terminal and run: ${CYAN}cd backend && npm start${NC}"
echo -e "2. Open another terminal and run: ${CYAN}cd frontend && npm start${NC}"
echo ""
echo -e "${YELLOW}Admin credentials:${NC}"
echo -e "Username: ${CYAN}admin${NC}"
echo -e "Password: ${CYAN}admin123${NC}"
echo ""
echo -e "Backend will run on: ${CYAN}http://localhost:5000${NC}"
echo -e "Frontend will run on: ${CYAN}http://localhost:3000${NC}"
echo ""
