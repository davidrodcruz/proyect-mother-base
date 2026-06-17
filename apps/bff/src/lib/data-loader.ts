import { readFileSync } from 'fs';
import { join } from 'path';
import type { FastifyInstance } from 'fastify';

const DATA_DIR = join(process.cwd(), 'src/data');

/**
 * Carga y parsea un archivo JSON del directorio de datos.
 * Lanza error si el archivo no existe o es inválido.
 */
export function loadJSON<T = unknown>(filename: string): T {
  const data = readFileSync(join(DATA_DIR, filename), 'utf-8');
  return JSON.parse(data);
}

/**
 * Crea una ruta GET que sirve contenido de un archivo JSON estático.
 * Ejemplo: createJsonRoute(fastify, '/profile', 'profile.json')
 */
export function createJsonRoute(
  fastify: FastifyInstance,
  path: string,
  filename: string,
  errorLabel?: string,
) {
  fastify.get(path, async (_request, reply) => {
    try {
      return loadJSON(filename);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: `Failed to load ${errorLabel || filename} data` });
    }
  });
}
