# SSH

## Create a public key

```bash
ssh-keygen -t ed25519
```

---

## Add a server to your SSH config

### Basics

SSH config is in `~/.ssh/config`.

```bash
# host names are arbitrary, change to your liking
Host <host-name> 
    Hostname <ip-address>
    User <username>
    # port forwarding to access gpu-host:<remote-port> on localhost:<local-port> from your browser
    LocalForward <local-port> 127.0.0.1:<remote-port>
    ForwardX11Trusted yes
    ForwardAgent yes
    PubkeyAcceptedKeyTypes +ssh-rsa
```

### With a proxy server

You may use a proxy server: to conect to a target server, you have to first connect to a proxy-server. In this case, your config might look like:

```bash
# the proxy server
Host proxy
    Hostname <ip-address>
    User <username-on-proxy>
    PubkeyAcceptedKeyTypes +ssh-rsa

# the target server
Host <gpu> 
    Hostname <ip-address>
    User <username>
    LocalForward <local-port> 127.0.0.1:<remote-port>
    ForwardX11Trusted yes
    ForwardAgent yes
    PubkeyAcceptedKeyTypes +ssh-rsa
    ProxyJump proxy  # this line allows you to connect through `proxy`
```

---

## No-password login

### The basics

**TLDR**: just add your public key to `~/.ssh/authorized_keys`

To be able to login to a server through SSH without being prompted for login, do:

```bash
ssh <host-name> "mkdir -p ~/.ssh && touch ~/.ssh/authorized_keys"
cat ~/.ssh/id_ed25519.pub | ssh <host-name> "cat >> ~/.ssh/authorized_keys"
```

**If you are using a proxy**, repeat the process on both your proxy server and target server.

### Maintain a common `authorized_keys`

`authorized_keys` allows a no-password SSH login. Since it only contains public keys, you can have a single `authorized_keys` and add it to different servers to connect to them without repating the above process.

Here is what your shared file could look like:

```bash
# this is a list of public keys to copy on all serers

# proxy server
<public key 1>

# personnal computer 
<public key 2>

# professional computer
<public key 3>
```

That way, you can proxy to a server from both your personnal and your professional computer !

---

## Login to a remote server in your GPU through SSH

See [here](https://github.com/Aikon-platform/aikon/wiki/Remote-development#4%EF%B8%8F%E2%83%A3configure-your-ide-to-work-remotely).


