# 🚀 Express + MySQL + Sequelize API

This project is a REST API on **Express.js** with **MySQL** database and **Sequelize** ORM.

## Installation and launch

1. Install MySQL (if not installed)

2. Copy `.env.example` and create `.env`

```sh
cp .env.example .env
```

3. Edit `.env` to include your details.

4. Install dependencies:

```sh
yarn install
```

5. Create a database:

```sh
yarn db:create
```

6. Start the server:

```sh
yarn start
```

7. After the server starts and displays the message "Database connected", perform the migrations:

```sh
yarn db:migrate
```

8. Everything is ready!
