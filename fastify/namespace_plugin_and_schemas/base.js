// base.js
const makeSchemaUri = (slug) =>
  `${process.env.APP_BASE_URL}/schemas/${slug}/version`;

const getSchemaByUri = (fastify, slug) =>
  fastify.getSchema(makeSchemaUri(slug));

function baseSchemas(fastify, options, done) {
  const schemas = [
    {
      $id: makeSchemaUri("base"),
      type: "object",
      properties: {
        id: { type: "string" },
        uri: { type: "string", const: makeSchemaUri("base") },
      },
      required: ["id", "uri"],
    },
    {
      $id: makeSchemaUri("item"),
      type: "object",
      properties: {
        slug: { type: "string" },
        schema: { $ref: makeSchemaUri("base") },
      },
      required: ["slug", "schema"],
    }
  ];

  // Register schemas
  schemas.forEach(schema => fastify.addSchema(schema));

  const baseApi = {
    makeSchemaUri,
    getSchemaByUri: (slug) => getSchemaByUri(fastify, slug),
    getSchemas: () => schemas,
  };
  fastify.decorate('baseSchemasApi', baseApi);
  done();
}

export default baseSchemas;
