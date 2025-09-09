# Fastify plugins: namespaced plugins

---

## Fastify plugins in a nutshell

[https://fastify.dev/docs/latest/Guides/Plugins-Guide/](https://fastify.dev/docs/latest/Guides/Plugins-Guide/)

With fastify, you can access plugins in 2 manners:
- `fastify.register(plugin)`: loads the plugin in the fastify instance
- `fastify.decorate("pluginName", plugin)`: makes the plugin accessible by running `fastify.pluginName`.

Normally, fastify plugins are encapsulated: fastify plugins defined in the parent are only available to child plugins, not to parent or sibling plugins.

```js
fastify.register((instance, opts, done) => {
  instance.decorate('util', (a, b) => a + b)
  console.log(instance.util('that is ', 'awesome'))

  fastify.register((instance, opts, done) => {
    console.log(instance.util('that is ', 'awesome')) // This will not throw an error
    done()
  })

  done()
})

fastify.register((instance, opts, done) => {
  console.log(instance.util('that is ', 'awesome')) // This will throw an error

  done()
})
```

`fastify-plugin` bypasses the encapsulation : when a plugin is decorated with `fastifyPlugin`, its scope is not limited to the descendants of the plugin. In that case, what is defined in the plugin can be accessible outside of it/

```js
const fp = require('fastify-plugin')
const dbClient = require('db-client')

function dbPlugin (fastify, opts, done) {
  dbClient.connect(opts.url, (err, conn) => {
    fastify.decorate('db', conn)
    done()
  })
}

module.exports = fp(dbPlugin)
```

---

## Our issue: namespaced plugins

I have the following plugin hierarchy (note that plugin hierarchy is not directory structure):

```
index.js
  |_schemas.js
      |_base.js
      |_presentation2.js
```

`index` loads the plugin `schemas` that loads the plugins `base` and `presentation`. `base` and `presentation` both define 2 functions: `makeSchemaUri` and `getSchemaByUri`. 

`base` and `presentations2` are both used to define JSON schemas (using `fasify.getSchemas`).

### The problem

`base` and `presentation` both contained the snippet:

```js
const makeSchemaUri = () => {/** */}
fastify.decorate("makeSchemaUri", makeSchemaUri) 
```

The problem, then, is that `makeSchemaUri` and `getSchemaByUri` are both registered on the global `fastify` instance, so we get a conflict where 2 plugins have the same name.

### Solution 1: namespace for the plugin functions 

[code example](./namespace_plugin)

This partial solution does 2 things:
- plugin schemas are registered on the global Fastify instance
- plugin functions and data are stored in a JSON object that is used to decorate fastify

So, in fact, schemas are not namespaced, only functionnalities are.

```js
// base.js
const makeSchemaUri = (slug) =>
  `${process.env.APP_BASE_URL}/schemas/${slug}/version`;

const getSchemaByUri = (fastify, slug) =>
  fastify.getSchema(makeSchemaUri(slug));

function baseSchemas(fastify, options, done) {
  // Example schema registration using makeSchemaUri
  fastify.addSchema({
    $id: makeSchemaUri("base"),
  });

  const baseApi = {
    makeSchemaUri,
    getSchemaByUri: (slug) => getSchemaByUri(fastify, slug),
  };
  fastify.decorate('baseSchemasApi', baseApi);
  done();
}

export default baseSchemas;
```

### Solution 2: namespace the plugin functions and the namespaces

[code example](./namespace_plugin_and_schemas)

This is a fuller solution, but hackier:
- schemas are registered on the global fastify instance
- functions are exported in an API
- a `getSchemas` function is also defined in this API. it displays all the schemas in namespace. this is a bit hacky IMO.


