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

5. Run the `start` command, it will create the database, start the server and perform migrations:

```sh
yarn start
```

If everything went well, you should see the message "✅ Setup complete. Server is ready!"
