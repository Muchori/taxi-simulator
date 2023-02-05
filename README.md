# Taxi-Simulator

We need you to build a simple backend API that can be accessed by an admin user. This user
can be hard-coded for this exercise and there is no need to manage users roles. This user will
need to create and suspend drivers and monitor ongoing rides.
Also we would like for you to simulate passengers calling drivers, and have you create some
endpoints to register passengers and perform a ride simulation (no geolocation calculation is
necessary to link the passenger with the best driver, this can be passed in the API).

## Description

NestJS REST API simulating a taxi ordering ride by a passenger.

## Table of Contents

- [Taxi-Simulator](#taxi-simulator)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technlogies and Tools used](#technlogies-and-tools-used)
  - [Quick run](#quick-run)
  - [Comfortable development](#comfortable-development)
  - [Links](#links)
  - [Database utils](#database-utils)
  - [Tests](#tests)
  - [Tests in Docker](#tests-in-docker)
  - [Test benchmarking](#test-benchmarking)

## Features

- [x] Database ([typeorm](https://www.npmjs.com/package/typeorm)).
- [x] Seeding.
- [x] Config Service ([@nestjs/config](https://www.npmjs.com/package/@nestjs/config)).
- [x] Sign in and sign up via email.
- [x] Admin and User roles.
- [x] Swagger.
- [x] E2E and units tests.
- [x] Docker.

## Technlogies and Tools used

- [x] TypeScript / JavaScript
- [x] NestJS Framework
- [x] Docker for containerization
- [x] Postgis / Postgres - Database
- [x] Jest for testing
- [x] Shell
- [x] Git and GitHub
- [x] Visual Studio Code

## Quick run

```bash
git clone --depth 1 git@github.com:Muchori/taxi-simulator.git
cd taxi-simulator/
cp env-example .env
docker compose up -d
```

For check status run

```bash
docker compose logs
```

## Comfortable development

I would recommend this for better experience

```bash
git clone --depth 1 git@github.com:Muchori/taxi-simulator.git
cd taxi-simulator/
cp env-example .env
```

Run additional container:

```bash
docker compose up -d postgres
```

```bash
npm install

npm run migration:run

npm run seed:run

npm run start:dev
```

## Links

- Swagger: http://localhost:3000/docs

## Database utils

Generate migration

```bash
npm run migration:generate -- src/database/migrations/CreateNameTable
```

Run migration

```bash
npm run migration:run
```

Revert migration

```bash
npm run migration:revert
```

Drop all tables in database

```bash
npm run schema:drop
```

Run seed

```bash
npm run seed:run
```

## Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e
```

## Tests in Docker

```bash
docker compose -f docker-compose.ci.yaml --env-file env-example -p ci up --build --exit-code-from api && docker compose -p ci rm -svf
```

## Test benchmarking

```bash
docker run --rm jordi/ab -n 100 -c 100 -T application/json -H "Authorization: Bearer USER_TOKEN" -v 2 http://<server_ip>:3000/api/v1/users
```
