# Docker

See:
- https://docs.docker.com/build/concepts/dockerfile/
- https://docs.docker.com/reference/dockerfile/
- https://docs.docker.com/reference/cli/docker/

---

## Concepts

- `image`: an image is a program or a set of programs packaged in a Dockerfile. Created after `docker build`
- `container`: a container is an instance of an image, created after `docker run`. 
    - *the image is the recipe, the container is the cake*
    - you have an image, which is a set of layers as you describe. If you start this image, you have a running container of this image. You can have many running containers of the same image.
    - see: https://stackoverflow.com/a/23736802

---

## Docker commands

### `build`

#### Command

```bash
docker build -f <path to Dockerfile> -t <image name> .
```

Where:
- `-t` provides the name of the Docker container you want to create
- `-f` provides the path to the Dockerfile
- `.` is the build context (`.` = current directory, `..` = previous directory, ...): what is accessible to the Docker container.

NOTES: 
- after modifying a Dockerfile, you need to rebuild it !
- use `docker images` to ensure your image has been installed. The name provided with `-t` should be listed under `REPOSITORY` 
- `-t` must be used right before the ARG (`.` in the example above) in order to have an effect. 

#### Build context

A build context indicates what can be accessed when building. Build context can be:

```
PATH | URL | -
```

Usually, the build context is a **filesystem context** (local directory, tar file, remote git repo). Then:
- the build context is **the set of files that the builder can access during the build**. 
- build instructions such as `COPY` and `ADD` can refer to any of the files and directories **in the context**.

### `run`

```bash
docker run [OPTIONS] IMAGE
```

For example:

```bash

```

### `images`: list all images

```bash
docker images
```

List all Docker images. An image is created after running `docker build`

### `ps` and `ls`: list containers

```bash
docker ps
```

List all Docker containers. A container is created after `docker run`.

- `docker ps` lists running containers
- `docker ps -a` lists all containers (running and stopped)

See: https://stackoverflow.com/a/16842203

---

## Dockerfile instructions / syntax

### `RUN`

```bash
RUN <command>
```

Runs a shell command, where `<command>` is either in shell form or in array form.

To run a multiline command:

```bash
RUN <<EOF
apt-get update
apt-get install -y curl
EOF
```

To have results of a command outputted to `stdout`, you need to run your Dockerfile with the following options:

```bash
--progress=plain --no-cache
```

See: https://stackoverflow.com/a/67548336

### `CMD`

```bash
CMD <command> <param1> <param2>
# or
CMD ["executable","param1","param2"]
# or, if an ENTRYPOINT is defined
CMD ["param1","param2"]
```

`CMD` describes the command to be executed when running a container. 
- **there can be only 1 `CMD`** per Dockerfile
- **it doesn't execute at build time**: use `docker run` to run a container
- you should **combine it with `ENTRYPOINT`**, to pass arguments and options to the `ENTRYPOINT` script.

### `COPY`

```bash
COPY <src> <dst>
```

Where:
- `<src>` is the **relative path from the build context or an absolute path**
- `<dst>` is the **destination file in the docker**. If it's a relative path, it depends on your `WORKDIR`.

### `WORKDIR`

```bash
WORKDIR <path>
```

Sets the **path of the working directory** in your Docker image. It can be used **several times** in a Dockerfile:

```bash
WORKDIR /var/www/html
RUN echo "Hello world !" > hello.txt
WORKDIR /
```

### `ENV`

```bash
ENV <var_name>=<value>
```

Defines an env variable for that docker image.

### `ARG`

```bash
ARG <name>[=<default value>]
```

Defines a variable that users can define at build time. Should be on top of the script, with the `ENV`, after the `FROM`
- if `ARG` is used before `FROM`, then `ARG` can be used to pass a variable to the `FROM`, but that `ARG` will be outside of *build context*: it can't be used in the rest of the build script.

```bash
docker build --build-arg <varname>=<value>
```

### `FROM`

```bash
FROM <image> [AS <name>]
```

Defines the base image to use in your Dockerfile.
- **it MUST be on top** of the Dockerfile. Only `ARG` may be used before, if `ARG` is used to provide arguments to the `FROM` command.
- if `AS <name>` is used, the `name` can be used to refer to this base image, which can be useful when using several `FROM` in a file.

```bash
ARG VERSION=latest
FROM busybox:$VERSION
ARG VERSION
RUN echo $VERSION > image_version
```

---

## Docker-compose instructions / syntax

### Environment management

There is a difference between:
1. the env variables **passed to the containers**
2. the env variables **available to the docker-compose by variable substitution**.

We use this file structure as an example:

```bash
/
|_app/
| |_.env             # a .env file for the docker containers
|_docker/
  |_Dockerfile.a     # Dockerfile of container A
  |_Dockerfile.b     # Dockerfile of container B
  |_docker-compose   # docker-compose orchestrating A and B 
```

#### 1. `env_file`: Passing an env variable to a container

In a docker-compose, the `env_file` field is used to **inject the environment variables from a .env file in the container.**

```yaml
services:
    a:
        env_file: 
            - ../app/.env  # relative path from docker-compose to .env
        # ...
```

This means that:
- the docker-compose will read the `.env` files listed in `env_file` and make environment variables defined there **accessible to the Docker container's execution environment**
- the `docker-compose` itself **will not have access to the variables defined in .env**.

Taking the above example: the variables in `app/.env`
- can't be referenced in `docker/docker-compose`
- will be accessible to `docker/Dockerfile.a`.

#### 2. Variable substitution: using env variables in a docker-compose

You can make env variables accessible to a docker-compose:

- Using `docker-compose --env-file`:
    ```bash
    docker-compose --env-file ../app/.env up
    ```
- Creating a `.env` in the same folder as the docker-compose:
    ```
    /
    |_docker/
      |_docker-compose
      |_.env  # variables in this  will be acessible to the docker-compose.
    ```
- Defining the variables in the execution environment in a bash way:
    ```bash
    source ../app/.env
    docker-compose up
    
    # or
    export MYVAR=myval  # ${MYVAR} will now be accessible to docker-compose
    docker-compose up
    ```

