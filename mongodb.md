# MONGO DB

the use case is MongoDB community edition used in Ubuntu/Linux, in a self-hosted context.

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
- a database is NOT created UNTIL data is written in it

### Helper `mongosh` commands 

```js
show dbs      // list all databases
use <dbName>  // switch to database `<dbName>`
```

---

## Users

`users` have the same role as in PostgreSQL : they are an authentication mechanism to manage databases and users. 
- `users` are granted specific `roles` on `databases` that define what they can do on a database.
- **an `authentication database`** is always associated to a user: it is a database that stores permissions for a user. it is not specific to that user (an authentication db can have multiple users). you can define authorizations for the user to access other databases.
- **by default, no users are created**: you can access a database without authentication.
- **the user administrator** is the 1st user you must create. it will be used to manage other users
- [user management commands](https://www.mongodb.com/docs/manual/reference/command/#std-label-user-management-commands)

### Commands 

#### Create the user administrator (first user)

you will need to restart mongodb after creating the user

1. start `mongod` and connect to it without authentication

```bash
mongod
```

2. create the user (in `mongosh`)

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

3. stop mongodb

```bash
sudo systemctl stop mongod

```

4. edit the config file by adding:

```
security:
    authorization: enabled
```

5. restart mongodb

```bash
sudo systemctl start mongodb
```

6. connect as a client using the user you want:

```bash
mongosh --port 27017 \
        --authenticationDatabase "admin" \  # the authentication database where user was creatd. here`admin`, see `use admin` above
        -u "<user name>" \
        -p "<user password>"
```

---

## Connection strings




