// presentation2.js
const IIIF_PRESENTATION_2 = "v2";
const makeSchemaUri = (slug) =>
  `${process.env.APP_BASE_URL}/schemas/presentation/${IIIF_PRESENTATION_2}/${slug}`;

const getSchemaByUri = (fastify, slug) =>
  fastify.getSchema(makeSchemaUri(slug));

function presentation2Schemas(fastify, options, done) {
  // Example schema registration using makeSchemaUri
  fastify.addSchema({
    $id: makeSchemaUri("manifest"),
    type: "object",
    properties: {
      type: { type: "string", const: "Manifest" },
      uri: { type: "string", const: makeSchemaUri("manifest") },
    },
    required: ["type", "uri"],
  });

  fastify.addSchema({
    $id: makeSchemaUri("canvas"),
    type: "object",
    properties: {
      type: { type: "string", const: "Canvas" },
      manifest: { $ref: makeSchemaUri("manifest") },
    },
    required: ["type", "manifest"],
  });

  const presentation2Api = {
    makeSchemaUri,
    getSchemaByUri: (slug) => getSchemaByUri(fastify, slug),
  };
  fastify.decorate('presentation2SchemasApi', presentation2Api);
  done();
}

export default presentation2Schemas;