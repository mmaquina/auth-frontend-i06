# Docker Configuration for Auth Server React Frontend

This document provides instructions on how to use the Docker configuration for the React frontend.

## Overview

The Docker configuration includes:

- Multi-stage build for production (optimized build)
- Development configuration with hot-reloading
- Nginx configuration for serving the production build
- Integration with the FastAPI backend

## Prerequisites

- Docker and Docker Compose installed on your system
- Git repository cloned locally

## Directory Structure

```
auth-server/
├── auth-server-fastapi/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   └── ...
└── auth-server-react-frontend/
    ├── Dockerfile
    ├── Dockerfile.dev
    ├── nginx/
    │   └── nginx.conf
    └── ...
```

## Development Environment

To start the development environment:

1. Create a `.env` file in the root directory of the FastAPI backend (copy from `.env.example`)
2. Create a `.env` file in the root directory of the React frontend (copy from `.env.example`)
3. Run the development environment:

```bash
cd auth-server-fastapi
docker-compose up
```

This will start:
- The FastAPI backend on port 8000
- The React frontend with hot-reloading on port 3000
- A PostgreSQL database on port 5432

## Production Environment

To start the production environment:

1. Create a `.env` file in the root directory of the FastAPI backend (copy from `.env.example`)
2. Set the environment variables for production
3. Run the production environment:

```bash
cd auth-server-fastapi
docker-compose -f docker-compose.prod.yml up -d
```

This will start:
- The FastAPI backend on port 8000
- The React frontend served by Nginx on port 80
- A PostgreSQL database on port 5432

## Environment Variables

### Frontend Environment Variables

- `NODE_ENV`: Set to `development` or `production`
- `REACT_APP_API_URL`: URL of the API backend
- `API_URL`: URL for Nginx proxy configuration

### Docker Environment Variables

- `FRONTEND_DOCKERFILE`: Set to `Dockerfile.dev` for development or `Dockerfile` for production
- `ENV`: Set to `dev` or `prod`

## Building the Images Separately

To build the frontend image separately:

```bash
cd auth-server-react-frontend
docker build -t auth-server-frontend:dev -f Dockerfile.dev .
```

For production:

```bash
cd auth-server-react-frontend
docker build -t auth-server-frontend:prod .
```

## Customizing Nginx Configuration

The Nginx configuration is located at `auth-server-react-frontend/nginx/nginx.conf`. You can modify this file to customize the Nginx configuration for your needs.

## Troubleshooting

### CORS Issues

If you encounter CORS issues, make sure the backend's `BACKEND_CORS_ORIGINS` includes the frontend URL.

### Connection Issues

If the frontend cannot connect to the backend, check that the `REACT_APP_API_URL` is correctly set in the frontend's environment variables.

### Container Communication

The containers communicate over the `auth-network` Docker network. Make sure this network is created and that all containers are connected to it.