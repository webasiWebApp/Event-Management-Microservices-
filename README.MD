# EventLink LK

Microservices event-planning platform (NestJS, PostgreSQL, RabbitMQ, Docker).

## Quick start
Copy `.env.example` to `.env`, then run `docker compose up --build -d`. The Vendor API is at http://localhost:3001 and Swagger UI at http://localhost:3001/docs. RabbitMQ UI: http://localhost:15672 (guest / guest).

## Vendor service local development
From `services/vendor-service`, run `npm install` and `npm run start:dev`. The service uses localhost defaults for PostgreSQL and RabbitMQ; set `DB_HOST=localhost` and `RABBITMQ_URL=amqp://guest:guest@localhost:5672` in `.env.local` when running outside Docker. The required fake request headers are `x-user-id` and `x-user-role` (`CLIENT`, `VENDOR`, `PLANNER`, or `ADMIN`).
