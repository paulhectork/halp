# NGINX

## Starting, stopping, reloading

nginx servers are configured using config files that are placed in the nginx directory, usually `/etc/nginx`. But where ?

### Folder structure and adding a new nginx config

```
/etc/nginx/
├── nginx.conf
├── sites-available
│   ├── aikon
│   └── default
├── sites-enabled
    ├── aikon -> /etc/nginx/sites-available/aikon
    └── default -> /etc/nginx/sites-available/default
```

In the example above, we have 3 places where to put our config:
- the global `nginx.conf`
- `sites-available/` stores all possible site configs
- `sites-enabled/` stores only activ sites. 
    - each config is stored as a symlink to a file in `sites-available/`. 
    - only configs here are loaded by nginx.
    - loading configs is done by, in the global `nginx.conf`, the line `include /etc/nginx/sites-enabled/*;`

**TLDR**: don't touch the global `nginx.conf`. To load a config, add it to `sites-available`, symlink it to `sites-enabled` and reload your conf.

### Loading, reloading, stopping an nginx config

Once you've got your nginx installed:

```bash
nginx -s reload  # (re)load the config file
nginx -s reopen  # reopen the log files
nginx -s stop    # fast shutdown
nginx -s quit    # graceful shutdown
```

Basicaly, `nginx -s reload` will reload the global `nginx.conf`, which will reload all `sites-enabled`.

---

## Configuration file structure

Nginx config files are made of **modules** controlle by **directives**.

### Basic syntax

#### Directives

- **simple directives** consist of a name followed by space-separated parameters and finished with `;`:
    ```nginx
    listen 443 ssl;
    ```
- **block directives** consist of a name followed by space-separated parameters and finished with a block (`{}`) containing additionnal instructions:
    ```nginx
        server {
        listen                      80;
        server_name                 app_name.domain-name.com;
        return                      301 https://$server_name$request_uri;
    }
    ```
- a **context** is a block directive containing other directives (i.e.: `server`, `location`, `http`)

#### Other syntax

- Regexes are prefixed with `~`: `~^www\d+\.example\.com$`

### Some contexts

#### `events`

Provides the configuration file context in which the directives that affect connection processing are specified.

#### `http`

Configuration context file in which HTTP server directives are specified. `http` defines the web-server level configuration and contains 1+ `server` directives, each defining the config for an individual application.

```nginx

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    # ...
    server {
        listen 8080;
        listen [::]:8080;
    }
}
```


#### `server`

Defines the configuration for a virtual server (aka a single app, or a website).
- a config file can have several virtual servers: one for HTTP, one for HTTPS...
- the `listen` directive defines the addresses and ports through which we can connect to the server.
- the `server_name` gives a name to the server (duh)
- some example configs can be found [here](https://nginx.org/en/docs/http/request_processing.html)

```nginx
server {
    listen                      80;
    server_name                 localhost
}
```

#### `location`

Defines configuration for a specific request URI. 

```nginx
location uri|uri-prefix|regex {
    # location-specific configuration
}
```

I.E: 

```nginx
# a configuration for all URLs prefixed by `/` (aka all URLs in an app)
location / {
    proxy_pass              http://127.0.0.1:8080;
    proxy_set_header        Host                   $host;
    proxy_set_header        X-Real-IP              $remote_addr;
    proxy_set_header        X-Forwarded-For        $proxy_add_x_forwarded_for;
    proxy_set_header        X-Forwarded-Proto      $scheme;
}

# a configuration to serve all images from a certain directory
location ~ \.(gif|jpg|png)$ {
    root /data/images;
}
```

### Some directives

#### `server_name`

Define the name for a virtual server. A lot of options are possible (regex-matching, partial matching...). [See here](https://nginx.org/en/docs/http/ngx_http_core_module.html#server_name) for more info.

```nginx
server {
    server_name www.example.com;
}
```

