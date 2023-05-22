## Deployment & Setup

I have used WAMP for this project for PHP and mysql functionality:
https://www.wampserver.com/en/, and Vite for the Frontend React Application: https://vitejs.dev/

The repo on my computer is under:

```bash
  C:\wamp64\www\Banyo
```

Depending on how you run your PHP and Mysql Server, the path may change, and some files needs another value:

### Backend

Once installed, go into

```bash
  cd Backend
```

Then install all the composer packages with:

```bash
  php composer.phar update
```

Then you can run your wamp64 server and it's path should be

```bash
  "http://localhost/Banyo/Backend"
```

The backend has a `.env` file for env variables in the database, JWS_Secret and password hash:

```bash
  DB_HOST="localhost"
  DB_NAME=banyo
  DB_USER=root
  DB_PASS=
  JWS_SECRET="SuperSecretKey"
  PASSWORD_HASH="SuperSecretKey"
```

WARNING: Do not change the password hash if using the initialize command.

#### Initialize

To initialize the database, create a database called `banyo` in Mysql and call:

```bash
  http://localhost/Banyo/Backend/init
```

This will create the database table and create an `ADMIN` user if not already created, and will give it the password: `Admin`

### Frontend

Once installed, go into

```bash
  cd Brontend
```

And run the install command.

```bash
  npm i
```

This is also where Cypress is installed.

Before running the application, you need to create an `.env.development.local` file in your Frontend folder:

```bash
  VITE_BACKEND_PATH="http://localhost/Banyo/Backend"
```

#### Cypress

Before running Cypress, you need to run the application locally on your machine:

```bash
  npm run dev
```

After that you can run:

```bash
  npx cypress open
```

Choose e2e testing and whatever browser you want, i myself am using firefox.
All tests are located under

```bash
  Frontend/cypress/e2e/
```
