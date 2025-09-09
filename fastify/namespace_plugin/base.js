// base.js
const makeSchemaUri = (slug) =>
  `${process.env.APP_BASE_URL}/schemas/${slug}/version`;

const getSchemaByUri = (fastify, slug) =>
  fastify.getSchema(makeSchemaUri(slug));

function baseSchemas(fastify, options, done) {
  // Example schema registration using makeSchemaUri
  fastify.addSchema({
    $id: makeSchemaUri("base"),
    type: "object",
    properties: {
      id: { type: "string" },
      uri: { type: "string", const: makeSchemaUri("base") },
    },
    required: ["id", "uri"],
  });

  // You can register more schemas as needed
  fastify.addSchema({
    $id: makeSchemaUri("item"),
    type: "object",
    properties: {
      slug: { type: "string" },
      schema: { $ref: makeSchemaUri("base") },
    },
    required: ["slug", "schema"],
  });

  const baseApi = {
    makeSchemaUri,
    getSchemaByUri: (slug) => getSchemaByUri(fastify, slug),
  };
  fastify.decorate('baseSchemasApi', baseApi);
  done();
}

export default baseSchemas;