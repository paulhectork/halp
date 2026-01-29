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

### Databases, collections, documents

A MongoDB `database` stores `collections` of `documents`.
- a `document` is a record stored in [BSON](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON), a binary format based on JSON
- a `collection` is a group of documents, and the equivalent of an SQL table
    - a collection does **not enforce a schema**
    - they are stored in a single database
- a `database` is a container for a collection.

Create a database: 
- a database is NOT created UNTIL data is written in it. 
- `use <dbName>` will switch to a (new) database, but if it does not exist, you need to write data to the database.

Create a collection:
- a collection is implicitly created when writing data in it
- `db.createCollection()` explicitly creates a collection. It can be used to enforce custom options.

```js
use myNewDB
db.myNewCollection1.insertOne( { x: 1 } )
```

### Helper `mongosh` commands 

```js
show dbs      // list all databases
use <dbName>  // switch to database `<dbName>`. creates it if it does not exist
```

---

## Indexes

Indexes speeds up queries: it replaces table lookups and removes the need for full collection scans.

Indexes can also **add constraints to a collection**, like UNIQUE constraints or sorting.

### In short

Minimally, an index is defined by: 

```js
{ "<fieldName>": 1/-1 }
````

Where: 
- `"<fieldName>"` is the name of the field you index
- `1/-1` is the sorting order: `1` is ascending, `-1` is descending.

**Indexes are ordered**: they store records by the order described in the index. In `{ "canvasIdx": 1 }`, the index will be ordered by values of `canvasIdx`, ascending. In turn, they can **be used to speed up sorts**.

### Types of indexes

#### Single field index 

Simple indexes on a single field: 

```js
{ "@id": 1 }
```

#### Compound index

Indexes on multiple fields

```js
{ "motivation": 1, "@id": 1 }
```
- **field order** is crucial: 
    - in the example above, we first sort by `motivation` before sorting on `@id` for each `motivation`.
    - this means that doing `myCollection.sort({ "@id": 1, "motivation": 1 })` WILL NOT benefit from the index defined above.
- compound indexes should be **tailored to the filters that will be used**: 
    - given the object: `{ "chars": "...", "motivation": "..."  }`
    - if `chars` and `motivation` are ALWAYS used in filters, do a compount index on both fields
    - if filtering is done on either `chars` OR `motivation`, create 2 indexes instead (and possibly, one on both fields).
    - When you have 2 indexes, MongoDB will filter successively on both indexes, which is still faster than a full collection scan.

#### Multikey index

When doing an index on values in an array, a MultiKey index is created.

- **it is useful to accelerate filters**: all indexed values are stored in an array, and documents containing that value will be retrieved using the index
- **it does not sort the documents**, it sorts the item in the array, To sort the documents, you need to **denormalize**: 
    - denormaliwing is extracting the value you actually want to sort your collection by and insert it as a scalar, outside of the array.
    - *example of denormalization*: 
        - source document: `{ id: 1, k: [{ a: 2 }, { a: 3 }, { a: 1 }] }`
        - denormalized version: 
        ```js
        {
            id: 1,
            k: [{ a: 2 }, { a: 3 }, { a: 1 }],
            k_a_primary: 1  // extracted the smalled value of `k`
        }
        ```

### Combining filters and sort indexes and ESR patterns

Sorting based on an index only works if we sort the entire collection OR if the filter keys are also part of the index:

- A sort index is useless if the filter is not indexed
- You need a filter index first, then the sort can be optimized.
- Without an index on the filter, expect full collection scan + in-memory sort — expensive.

To do filter+sorting, a single compound index must contain all filter fields and sort fields. Your filter needs to follow the [**ESR pattern**](https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-guideline/).

- `E` **equality**: first, the fields on which you are filtering (using an exact match)
- `S` **sort**: second, the fields on which you are sorting
- `R` **range**: `$gt`, `$lt`, `$regex` etc. are range filters. They don't require an exact match and are bound to index keys.

```js
// the query
db.cars.find(
   {
       manufacturer: 'Ford',
       cost: { $gt: 15000 }
   } ).sort( { model: 1 } )


// the ESR sort
{ manufacturer: 1, model: 1, cost: 1 }
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

