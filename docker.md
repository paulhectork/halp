# docker

see:
- https://docs.docker.com/build/concepts/dockerfile/
- https://docs.docker.com/reference/dockerfile/
- https://docs.docker.com/reference/cli/docker/

---

# concepts

- `image`: an image is a program or a set of programs packaged in a dockerfile. created after `docker build`
- `container`: a container is an instance of an image, created after `docker run`. 
    - *the image is the recipe, the container is the cake*
    - you have an image, which is a set of layers as you describe. if you start this image, you have a running container of this image. you can have many running containers of the same image.
    - see: https://stackoverflow.com/a/23736802

---

# docker commands

## `build`

### command

```bash
docker build -f <path to Dockerfile> -t <image name> .
```

where:
- `-t` provides the name of the docker container you want to create
- `-f` provides the path to the dockerfile
- `.` is the build context (`.` = current directory, `..` = previous directory, ...): what is accessible to the docker container.

notes: 
- after modifying a dockerfile, you need to rebuild it !
- use `docker images` to ensure your image has been installed. the name provided with `-t` should be listed under `REPOSITORY` 
- `-t` must be used right before the arg (`.` in the example above) in order to have an effect. 

### build context

a build context indicates what can be accessed when building. build context can be:

```
PATH | URL | -
```

usually, the build context is a **filesystem context** (local directory, tar file, remote git repo). then:
- the build context is **the set of files that the builder can access during the build**. 
- build instructions such as `COPY` and `ADD` can refer to any of the files and directories **in the context**.

## `run`

```bash
docker run [OPTIONS] IMAGE
```

for example:

```bash

```

## `images`: list all images

```bash
docker images
```

list all docker images. an image is created after running `docker build`

## `ps` and `ls`: list containers

```bash
docker ps
```

list all docker containers. a container is created after `docker run`.

- `docker ps` lists running containers
- `docker ps -a` lists all containers (running and stopped)

see: https://stackoverflow.com/a/16842203

---

# dockerfile instructions / syntax

## `RUN`

```bash
RUN <command>
```

runs a shell command, where `<command>` is either in shell form or in array form.

to run a multiline command:

```bash
RUN <<EOF
apt-get update
apt-get install -y curl
EOF
```

to have results of a command outputted to `stdout`, you need to run your dockerfile with the following options:

```bash
--progress=plain --no-cache
```

see: https://stackoverflow.com/a/67548336

## `CMD`

```bash
CMD <command> <param1> <param2>
# or
CMD ["executable","param1","param2"]
# or, if an entrypoint is defined
CMD ["param1","param2"]
```

`CMD` describes the command to be executed when running a container. 
- **there can be only 1 `CMD`** per dockerfile
- **it doesn't execute at build time**: use `docker run` to run a container
- you should **combine it with `ENTRYPOINT`**, to pass arguments and options to the `ENTRYPOINT` script.

## `COPY`

```bash
COPY <src> <dst>
```

where:
- `<src>` is the **relative path from the build context or an absolute path**
- `<dst>` is the **destination file in the docker**. if it's a relative path, it depends on your `WORKDIR`.

## `WORKDIR`

```bash
WORKDIR <path>
```

sets the **path of the working directory** in your docker image. it can be used **several times** in a dockerfile:

```bash
WORKDIR /var/www/html
RUN echo "Hello world !" > hello.txt
WORKDIR /
```

## `ENV`

```bash
ENV <var_name>=<value>
```

defines an env variable for that docker image.

## `ARG`

```bash
ARG <name>[=<default value>]
```

defines a variable that users can define at build time. should be on top of the script, with the `ENV`, after the `FROM`
- if `ARG` is used before `FROM`, then `ARG` can be used to pass a variable to the `FROM`, but that `ARG` will be outside of *build context*: it can't be used in the rest of the build script.

```bash
docker build --build-arg <varname>=<value>
```

## `FROM`

```bash
FROM <image> [AS <name>]
```

defines the base image to use in your dockerfile.
- **it must be on top** of the dockerfile. only `ARG` may be used before, if `ARG` is used to provide arguments to the `FROM` command.
- if `AS <name>` is used, the `name` can be used to refer to this base image, which can be useful when using several `FROM` in a file.

```bash
ARG VERSION=latest
FROM busybox:$VERSION
ARG VERSION
RUN echo $VERSION > image_version
```
---

# docker-compose instructions / syntax

## environment management

[source](https://stackoverflow.com/a/64723491)

there is a difference between:
1. the env variables **passed to the containers**
2. the env variables **available to the docker-compose by variable substitution**.

we use this file structure as an example:

```bash
/
|_app/
| |_.env             # a .env file for the docker containers
|_docker/
  |_Dockerfile.a     # dockerfile of container a
  |_Dockerfile.b     # dockerfile of container b
  |_docker-compose   # docker-compose orchestrating a and b 
```

### 1. `env_file`: passing an env variable to a container

in a docker-compose, the `env_file` field is used to **inject the environment variables from a .env file in the container.**

```yaml
services:
    a:
        env_file: 
            - ../app/.env  # relative path from docker-compose to .env
```

this means that:
- the docker-compose will read the `.env` files listed in `env_file` and make environment variables defined there **accessible to the docker container's execution environment**
- the `docker-compose` itself **will not have access to the variables defined in .env**.

taking the above example: the variables in `app/.env`
- can't be referenced in `docker/docker-compose`
- will be accessible to `docker/Dockerfile.a`.

### 2. variable substitution: using env variables in a docker-compose

you can make env variables accessible to a docker-compose:

- using `docker-compose --env-file`:
    ```bash
    docker-compose --env-file ../app/.env up
    ```
- creating a `.env` in the same folder as the docker-compose:
    ```
    /
    |_docker/
      |_docker-compose
      |_.env  # variables in this  will be acessible to the docker-compose.
    ```
- defining the variables in the execution environment in a bash way:
    ```bash
    source ../app/.env
    docker-compose up
    
    # or
    export MYVAR=myval  # ${MYVAR} will now be accessible to docker-compose
    docker-compose up
    ```

## multiple `compose` files

in docker-compose, you can merge together multiple docker-compose files so that
a base config is extended or overridden by other configs.

### specify the `compose` files

1. using `COMPOSE_FILE`: 
    ```bash
    COMPOSE_FILE=compose.yml:compose.prod.yml
    ```
    - note that `:` is the default separator on macOS/linux. on windows, separator is `;`
    - a custom separator can be set with the `COMPOSE_PATH_SEPARATOR` env
        variable
2. using `-f` in the command line:
    ```bash
    docker compose -f compose.yml -f compose.prod.yml up
    ```

### how docker handles merging

**order of files** is important: files are merged left to right, with rightmost
configs overriding earlier configs.

given `COMPOSE_FILE=compose1.yml:compose2.yml`, 
- docker-compose does a **union of both configs**:
    - entries present in `compose1.yml` but not in `compose2.yml` are present
        in the final config
    - entries present in `compose2.yml` but not in `compose1.yml` are appended
        to the final config
- conficts are resolved using a **deep merge strategy**: the yaml trees are
    traversed and replacements are only done where a conflict occurs.
- **replacement of values depend on field type**:
    - **scalar values: last one wins**
    ```yaml
    # `myapp.1.2.3` is kept in the final config

    # compose2.yml
        services:
          web:
        image: myapp:latest

    # compose1.yml
    services:
      web:
        image: myapp:1.2.3
    ```
    - **maps/dictionnaries: merging is done key-by-key** (union of keys in
        `compose1` and `compose2`, and where there is conflict, values from
        `compose2` prevails
    ```yaml
    # in the final config: `DEBUG: false, LOG_LEVEL: info`

    # compose1.yml
    environment:
      DEBUG: "true"
      LOG_LEVEL: "info"

    # compose2.yml
    environment:
      DEBUG: "false"
  ```
  - **lists: values are appended** (except for some fields where values are
      replaced instead).


## docker compose profiles

see: https://docs.docker.com/compose/how-tos/profiles/

profiles let you **selectively start services** in a compose file, instead of always starting all of them with `docker compose up`.

### defining a profile

```yaml
services:
  web:
    image: myapp:latest
  debug-tools:
    image: busybox
    profiles:
      - debug
  db-backup:
    image: backup-tool
    profiles:
      - debug
      - backup
```

where:
- a service with **no `profiles` key** is considered part of the **default profile**: it always starts, no matter what.
- a service **with `profiles` defined** only starts when **one of its listed profiles is activated**.
- a service can belong to **several profiles** at once (`db-backup` above starts if either `debug` or `backup` is active).

### activating profiles

#### via cli flag

```bash
docker compose --profile debug up
```

you can pass `--profile` **several times** to activate multiple profiles:

```bash
docker compose --profile debug --profile backup up
```

#### via env variable

```bash
COMPOSE_PROFILES=debug,backup
```

- comma-separated, no spaces.
- same effect as passing `--profile` for each one.

### starting a specific service explicitly

even if a service's profile isn't activated, you can still start it **by name**:

```bash
docker compose up debug-tools
```

this starts `debug-tools` (and its dependencies) **regardless of active profiles**. profiles only gate the *default*, "start everything" behavior of `docker compose up` with no service names.

### notes

- profiles are useful to separate **optional tooling** (debug containers, seed scripts, backup jobs, ...) from the **core services** that should always run.
- `docker compose config --profiles` lists all profiles found in a compose file.
- `docker compose config --services` lists services that **would be started** given the currently active profiles.

## volumes

volumes are used:
1. **to mirror the contents** of a docker container and a host server
2. **to share data between containers**, since the host server volume will be mounted in the container.

### define a volume to mirror the contents of a container and a host

```yaml
services:
    <container-name>:
        volumes:
            - <host-volume>:<container-volume>:flags?
```

for example:

```yaml
services:
    nginx:
        - ./nginx.conf:/etc/nginx/nginx.conf:ro
        - ../app/staticfiles:/home/aikon/app/staticfiles:ro
```

### 2. define a named volume

to do this, you must define the top-level `volumes` declaration:

```yaml
services:
    ...
volumes:
    <volume_name>:
        <extra config (optional)>
```

[see here for more info.](https://docs.docker.com/reference/compose-file/volumes/)

### flags

you can add flags to a volume mount:

```yaml
# syntax
host-volume:container-volume:flags
# example
./nginx.conf:/etc/nginx/nginx.conf:ro
```

- `:ro` means **read-only**: the mount is read-only and you cannot write or delete its contents.


### content overriding

**tldr: container runtime staticfiles == host staticfiles**

**if a volume is mounted on a path, the image contents at that path are completely ignored.**

if you have a container `containerA` and a volume `/app/webapp/static`, 
- the host will have a folder `/app/webapp/static`
- the container will have the same folder.

but, at run time, **contents of the container folder will be overwritten by contents of the host volume**. 

this means that, no matter what you see in containera (i.e., running `docker exec -it docker-containerA-1 ls /app/webapp/static`), docker will override its contents with the volume on the host.

---

# free up space

```bash
# list docker disk usage
docker system df

# remove all unused containers, networks, images, and cache (everything except volumes)
docker system prune -a

# remove all unused volumes (⚠️ can delete important data if volumes are no longer attached to a container)
docker volume prune
# preview what will be deleted by volume pruning
docker volume ls -f dangling=true

# remove all stopped containers
docker container prune

# remove all unused images
docker image prune -a
```

