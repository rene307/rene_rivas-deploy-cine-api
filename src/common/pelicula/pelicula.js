// src/pelicula/pelicula.js
export const Pelicula = {
  _id:       'ObjectId',
  nombre:    'string',
  generos:   'array',
  anioEstreno: 'int'
};

// Validación mínima según el schema de la pauta
export function validatePelicula(body) {
  const { nombre, generos, anioEstreno } = body ?? {};
  if (typeof nombre !== 'string' || !nombre.trim()) return 'nombre(string) requerido';
  if (!Array.isArray(generos)) return 'generos(array) requerido';
  if (!Number.isInteger(anioEstreno)) return 'anioEstreno(int) requerido';
  return null;
}
