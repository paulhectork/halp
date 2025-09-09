import Fastify from "fastify";
import schemas from "./schemas.js";

const fastify = Fastify();

await fastify.register(schemas);

fastify.schemas.base.makeSchemaUri("example");
fastify.schemas.presentation2.makeSchemaUri("example");

