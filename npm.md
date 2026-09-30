# Publish a library on NPM and set it up

---

## Publish an NPM package with 2FA (sept. 2027)

### The problem

NPM chose to make my life more difficult by deprecating "bypass 2FA" tokens AND TOTP 2FA (2FA through an external app, i.e. a phone) (.....). Your only option to publish a package is to **enable 2FA on your NPM account with another method than TOTP**. Possible methods are biometric identification, hardware key or using bitwarden.

### 1. Enable 2FA on NPM with Bitwarden

**You will need**:
- a Bitwarden account (free tier is ok)
- Google Chrome
- the Bitwarden Google Chrome extension

**The process**
- login to [npmjs.org](npmjs.org) on Google Chrome
- go to your NPM account settings (`https://www.npmjs.com/settings/your-user-name/tfa/`) and click "Enable 2FA"
- select "Create a new security key"
- name the key (i.e., `npm`)
- a Bitwarden popup will open. Follow the steps to create a new passkey

### 2. Create a 2FA token on NPM

**The process**
- still use Google Chrome with the Bitwarden extension
- go to the tokens page (`[/your-user-name](https://www.npmjs.com/settings/your-user-name/tokens/granular-access-tokens/new)`)
- create a token with 2FA disabled and Read/Write permissions
- you will be prompted for 2FA authentication, follow instructions

### 3. Publish your package

In the terminal,

```bash
npm publish
```

You will be asked to:
- login
- authentify with 2FA

**Do both in Google Chrome with the Bitwarden extension**. 

---

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

