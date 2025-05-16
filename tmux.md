# TMUX

## Detach (leave) and attach (come back to) a session

Create a session:
```bash
tmux new -s <session_name>  # create a session named `<session_name>`
```

In tmux, detach the session with the shortcuts:
```bash
ctrl+b d  # ctrl+b, then d
```

You are now detatched (out of the session). Attach (re-enter the session) with:
```bash
tmux attach-session -t <session_name>   # target the session you want to attatch to by its name
```
