// src/actor/actor.js
export const Actor = {
  _id:         'ObjectId',
  idPelicula:  'string', // ObjectId como string en la petición
  nombre:      'string',
  edad:        'int',
  estaRetirado:'bool',
  premios:     'array'
};

export function validateActor(body) {
  const { idPelicula, nombre, edad, estaRetirado, premios } = body ?? {};
  if (typeof idPelicula !== 'string' || !idPelicula.trim()) return 'idPelicula(string) requerido';
  if (typeof nombre !== 'string' || !nombre.trim()) return 'nombre(string) requerido';
  if (!Number.isInteger(edad)) return 'edad(int) requerida';
  if (typeof estaRetirado !== 'boolean') return 'estaRetirado(bool) requerido';
  if (!Array.isArray(premios)) return 'premios(array) requerido';
  return null;
}
