# Async plugins

## Synchronous plugins

Synchronous plugins have the following signature:

```js
function myPlugin(fastify, options, done) {
    // plugin specific code
    done();
}
```

Here, **`done()` is a callback** that indicates that plugin definition is finished.

---

## Asynchronous plugins

If using `done()` in an async plugin, you will get the error: `FST_ERR_PLUGIN_INVALID_ASYNC_HANDLER` that indicates you are mixing `async/await` and `callbacks` in your code. 

Async plugin definition **MUST NOT use `done`**:

```js
async function myPlugin(fastify, options, done) {
    // plugin specific code
}
```

---

## TLDR

- If your plugin is an async function, do not include the done callback as a parameter.
- If your plugin uses the done callback (i.e., is not async), you must call done() manually and do not use async/await.
- Fastify sees both the async keyword and the done parameter and throws `FST_ERR_PLUGIN_INVALID_ASYNC_HANDLER`.


