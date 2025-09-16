# ChipChip

A full-stack web application built with FastAPI backend and React frontend, featuring user authentication, tweet management, and a modern UI.

## Tech Stack

- **Backend**: FastAPI, SQLModel, PostgreSQL, Python 3.10+
- **Frontend**: React, TypeScript, Vite, Chakra UI
- **Development**: Docker Compose, pre-commit hooks
- **Authentication**: JWT tokens
- **Database**: PostgreSQL with Alembic migrations

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Git

### 1. Clone and Setup

```bash
git clone <your-repo-url> chipchip
cd chipchip
```

### 2. Configure Environment

The project comes with a `.env` file. For security, update these values before running:

```bash
# Generate a secure secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Edit `.env` and update:
- `SECRET_KEY` - Use the generated key above
- `FIRST_SUPERUSER_PASSWORD` - Set a secure admin password
- `POSTGRES_PASSWORD` - Set a secure database password

### 3. Start the Application

```bash
docker compose watch
```

This starts all services with hot-reload enabled for development.

## Access Points

Once running, you can access:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database Admin**: http://localhost:8080
- **Traefik Dashboard**: http://localhost:8090

## Default Login

- **Email**: admin@example.com
- **Password**: (whatever you set in `FIRST_SUPERUSER_PASSWORD`)

## Development

### Backend Development

```bash
# Stop Docker backend service
docker compose stop backend

# Run backend locally
cd backend
uv sync
uv run fastapi dev app/main.py
```

### Frontend Development

```bash
# Stop Docker frontend service
docker compose stop frontend

# Run frontend locally
cd frontend
npm install
npm run dev
```

### Code Quality

The project uses pre-commit hooks for code formatting and linting:

```bash
# Install pre-commit (one-time setup)
uv run pre-commit install

# Run manually on all files
uv run pre-commit run --all-files
```

### Testing

```bash
# Backend tests
cd backend
uv run pytest

# Frontend tests
cd frontend
npm run test
```

## Project Structure

```
├── backend/          # FastAPI application
│   ├── app/          # Main application code
│   ├── alembic/      # Database migrations
│   └── tests/        # Backend tests
├── frontend/         # React application
│   ├── src/          # Frontend source code
│   └── tests/        # Frontend tests
├── docker-compose.yml     # Main services
├── docker-compose.override.yml  # Development overrides
└── .env              # Environment configuration
```

## Features

- User registration and authentication
- JWT-based session management
- Tweet creation and management
- Dark/light mode toggle
- Responsive design
- Automatic API client generation
- Database migrations
- Email support (configure SMTP)

## Deployment

For production deployment, see [deployment.md](./deployment.md).

## License

MIT License