# SAS: export data from Docker image and load it to a local Jena instance

## 1. In the `sas` container, install the Jena distrubition

**Run in the SAS container**

```bash
# you can change your install dir to whatever
cd /tmp
wget https://archive.apache.org/dist/jena/binaries/apache-jena-4.3.1.tar.gz
tar -xzf apache-jena-4.3.1.tar.gz

# Set JENA_HOME
export JENA_HOME=/tmp/apache-jena-4.3.1

# Run tdbdump
$JENA_HOME/bin/tdbdump --loc=/path/to/data > /tmp/export.nq
```

## 2. Run the export

**Run on the host server** (can also be run from the container if afterwards you copy the export file to host)

```bash
docker exec docker-sas-1 sh -c 'export JENA_HOME=/tmp/apache-jena-4.3.1 && $JENA_HOME/bin/tdbdump --loc=/path/to/data' > export.nq
```

## 3. Install Fuseki Jena on your local machine

**Run on your local machine**

From [this page](https://jena.apache.org/download/), download `apache-jena-fuseki-$version.tar.gz` and extract it to your directory of choice (below, we assume it's `.`, your current directory).

## 4. Copy the export from the remote server to your machine

**Run on your local machine**

```bash
scp $remote_user@$remote_host:/path/to/export.nq .
```

## 5. Import data into your Jena database

**Run on local machine** If you want to see the output of Fuseki Jena, run the `start fuseki` step in another terminal without the trailing `&`.

```bash
mkdir data/  # directory where the database file will be stored

# start fuseki
java -jar ./fuseki-server.jar --loc=./data --update /sas/ &

# wait for start to work
sleep 3

# import data
curl -X POST -T export.nq \
  -H "Content-Type: application/n-quads" \
  "http://localhost:3030/sas/data?graph=default"
```

Check if the import worked by running this query (`?g` = query all graphs):

```sparql
SELECT DISTINCT ?s ?p ?o WHERE { GRAPH ?g { ?s ?p ?o } } LIMIT 20
```
