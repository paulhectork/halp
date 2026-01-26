# Publish a library on NPM and set it up

## Publish an NPM package (jan. 2026)

Since the end of 2025, to publish, you need to either enable 2FA or to have an access token with "bypass 2FA" enabled.

1. Create an access token with Read/Write permissions on your package and "bypass 2FA" enabled: `Account/Access tokens`
2. Update your NPM config with an access token: 
    ```bash
    export NPM_TOKEN="YOUR_TOKEN"
    npm config set //registry.npmjs.org/:_authToken "${NPM_TOKEN}"
    ```
3. Publish your package
    ```bash
    npm publish
    ```

It is also possible to update your `.npmrc` file.

## Publish with an NPM package with MongDB

> This is a chatgpt guide on how to publish an app with a mongodb database on NPM and set up the mong o database for the project.

### TLDR

- you can't install MongoDB from an NPM package. 
- you must create JS scripts that generate the database, do migrations etc, populate it.

### 1\. **NPM Package Structure**

Your NPM package should have the following basic structure:

```
your-package/
├── bin/
│   └── setup.js  # or have your script elsewhere in the app. it will be called through NPM
├── config/
│   └── default.json (or .env.example)
├── migrations/
│   └── 001_initial.js
├── src/
│   └── index.js
├── package.json
└── README.md
```

---

### 2\. **Configuration File**

Best practice is to use something like [`config`](https://www.npmjs.com/package/config) or `.env` with [`dotenv`](https://www.npmjs.com/package/dotenv) for database connection configuration.

#### Example `config/default.json`:

JSON:
```js
{
  "mongodb": {
    "uri": "mongodb://localhost:27017/yourdbname",
    "username": "",
    "spassword": ""
  }
}
```

Or use `.env`:

```bash
MONGO_URI=mongodb://localhost:27017/yourdbname
MONGO_USER=yourusername
MONGO_PASS=yourpassword
```

---

### 3\. **Database Creation & Migrations**

*   **Migrations:** Use a library like [`migrate-mongo`](https://www.npmjs.com/package/migrate-mongo) or roll your own scripts in the `migrations/` folder.
*   **Database Creation:** MongoDB will auto-create a database upon first connection if it doesn't exist. So _simply connecting/writing data_ is sufficient.

---

### 5\. **Setup Script**

A `bin/setup.js` script can guide the user through configuration, connecting to Mongo, and running migrations.  
Add in `package.json`:

```js
"bin": {
  "your-package-setup": "./bin/setup.js"
}
```

**Sample `bin/setup.js`:**

```js
#!/usr/bin/env node
const { MongoClient } = require('mongodb');
require('dotenv').config();
const config = require('config'); // or use dotenv

const uri = process.env.MONGO_URI || config.get('mongodb.uri');

(async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    // Optionally check existence or seed DB
    console.log("Connected to MongoDB!");

    // Run migrations, e.g.: require('../migrations/001_initial')
    // Or call `migrate-mongo up`

    await client.close();
    console.log("Setup complete!");
  } catch (err) {
    console.error("Could not complete setup:", err);
    process.exit(1);
  }
})();
```

Make it executable: `chmod +x bin/setup.js`

- - -

### 6\. **Publishing to NPM**

1.  Set up your `package.json` with required fields.
2.  Make sure not to include `node_modules`, and never bundle the MongoDB binary itself.
3.  Add peerDependency on `mongodb` package if you like, or just include it directly.
4.  `npm publish`

- - -

### 7\. **Instruct Users on MongoDB Installation**

Your `README.md` **must** tell users to:

*   [Install MongoDB themselves](https://docs.mongodb.com/manual/installation/)
*   Create/configure the cluster
*   Set up access

You might optionally provide helper scripts to download/test-run local MongoDB for development purposes, but for production, they must install and manage MongoDB themselves.

- - -

### **Summary Table**

| Requirement | Possible in NPM? | Best Practice |
| --- | --- | --- |
| Package requires MongoDB | Yes | Use `mongodb` or `mongoose` in dependencies |
| Configurable with conf file | Yes | Use a config system or `.env` |
| Creates database on setup | Yes\* | Mongo auto-creates, setup script can connect/seed |
| Has migrations scripts | Yes | Use scripts or migration libraries |

