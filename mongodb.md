# MONGO DB

The use case is MongoDB community edition used in Ubuntu/Linux, in a self-hosted context.

---

## Basics

### Terminology 

- `mongod` is the MongoDB daemon (the server for mongodb)
    - `127.0.0.1` is the default localhost, `27017` is the default port to connect to `mongod`
    - starting `mongod` (in linux using a `service`) starts a server cluster (in Mongodb, you connect to a cluster of servers, in which you have a primary database server, and possibly other replica servers. so it's distributed).
- `mongosh` is the client Mongodb shell that allows you to access `mongod`. the language of `mongosh` is JavaScript
- the mongodb config file in Linux is located in `/etc/mongod.conf`

### Commands

```bash
# start / stop / get status for the mongodb service
sudo systemctl start|stop|status mongod

# launch an interactive mongo script
mongosh
```

---

## Databases

- the default databases in self-hosted localhost are `admin`, `config`, `local`
- `use <dbName>` is the `mongosh` command to create a database
- a database is NOT created UNTIL data is written in it

### Helper `mongosh` commands 

```js
show dbs      // list all databases
use <dbName>  // switch to database `<dbName>`. creates it if it does not exist
```

---

## Users

Users have the same role as in PostgreSQL : they are an authentication mechanism to manage databases and users. 
- `users` are granted specific `roles` on `databases` that define what they can do on a database.
- **an `authentication database`** is always associated to a user: it is a database that stores permissions for a user. it is not specific to that user (an authentication db can have multiple users). you can define authorizations for the user to access other databases.
- **by default, no users are created**: you can access a database without authentication.
- **the user administrator** is the 1st user you must create. it will be used to manage other users
- [user management commands](https://www.mongodb.com/docs/manual/reference/command/#std-label-user-management-commands)

### Commands 

#### Create the user administrator (first user)

[(source)](https://www.mongodb.com/docs/manual/tutorial/configure-scram-client-authentication/)

You will need to restart mongodb after creating the user in order to restart mongodb with authentication.

1. **start `mongod` and connect to it** without authentication

```bash
sudo systemctl mongod  # or `mongod`. the default `mongod` service starts without authentication
```

2. **create the user** (in `mongosh`)

```js
use admin  // switch to the admin database. this means that the `authenticationDatabase` for the new user will be `admin`
db.createUser(
  {
    user: "<username>",    // name of the user
    pwd: passwordPrompt(), // promt of a password, or use a cleartext password
    roles: [
      { role: "userAdminAnyDatabase", db: "admin" },  // will be user admin on all dbs
      { role: "readWriteAnyDatabase", db: "admin" }   // can read/write on all dbs
    ]
  }
)
```

3. **stop `mongod`**

```bash
sudo systemctl stop mongod
```

4. **edit the config file** (`/etc/mongod.conf`) by adding:

```
security:
    authorization: enabled
```

5. **restart mongodb**

```bash
sudo systemctl start mongodb
```

6. **connect as a client** with the user you want:

```bash
mongosh --port 27017 \
        --authenticationDatabase "admin" \  # the authentication database where user was creatd. here`admin`, see `use admin` above
        -u "<user name>" \
        -p "<user password>"
```

---

## Connection strings

### URI anatomy 

[(source)](https://www.mongodb.com/docs/manual/reference/connection-string/#find-your-self-hosted-deployment-s-connection-string)

**Connexion string anatomy:**
- [SRV format](https://www.mongodb.com/docs/manual/reference/connection-string/#std-label-connections-dns-seedlist)
    ```
    mongodb+srv://[username:password@]host[/[defaultauthdb][?options]]
    ```
- [standard format](https://www.mongodb.com/docs/manual/reference/connection-string/#find-your-self-hosted-deployment-s-connection-string)
    ```
    mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
    ```
- NOTES:
    - the syntax of both URIs is the same; adding `+srv` to the prefix will indicate that we are using an SRV connexion to `mongod`.
    - if you are logged in `mongosh`, `db.getMongo()` will return the conexion string.

**Connexion string parameters:**
- `username@password`: pretty straightforward, right ?
    - NOTE characters `$ : / ? # [ ] @` in the usename and password MUST be percent-encoded.
- `host:port`: host and port of the mongosh instance
- `defaultauthdb`: the authentication database to use if the connexion string includes `username@password` but the `authSource` is nt included in the authstring options.

### Examples

```
# standard connexion after a fresh install
mongodb://127.0.0.1/
```

--- 

## Troubleshooting and fixes

### `exit code 14`

`sudo systemctl start mongod` can fail with `exit code 14` if a previous `mongod` instance was badly killed. [info](https://stackoverflow.com/a/53494635)

SOLUTION: delete the `sock` connexion file. `27017` is the `mongod` port. if you use another one, update the filename below.

```bash
sudo rm /tmp/mongodb-27017.sock
sudo systemctl start mongod
```

