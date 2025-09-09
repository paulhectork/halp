// schemas.js
import baseSchemas from "./base.js";
import presentation2Schemas from "./presentation2.js";

function schemas(fastify, options, done) {
  fastify.register(baseSchemas);
  fastify.register(presentation2Schemas);

  fastify.decorate('schemas', null); // placeholder

  fastify.after(() => {
    fastify.schemas = {
      base: fastify.baseSchemasApi,
      presentation2: fastify.presentation2SchemasApi,
    };
  });

  done();
}

export default schemas;