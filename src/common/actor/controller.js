// src/common/actor/controller.js
import { ObjectId } from 'mongodb';

// FIX: Este archivo está DENTRO de src/common/actor, por eso
//      para llegar a src/common/db.js se usa '../db.js' (NO '../common/db.js').
import {
  actorCollection,
  peliculaCollection,
} from '../db.js'; // FIX ruta
import { validateActor } from './actor.js';

// ❌ ERROR que tenías: la línea suelta `from '../db.js'`
//    Eso no es sintaxis válida en JavaScript y hace fallar el build.
//    Ya fue eliminada.

// POST /api/actor
export async function handleInsertActorRequest(req, res) {
  // 1) Validación de esquema (campos y tipos)
  const error = validateActor(req.body);
  if (error) return res.status(400).json({ error });

  const { idPelicula, nombre, edad, estaRetirado, premios } = req.body;

  // 2) Validar formato de ObjectId
  if (!ObjectId.isValid(idPelicula)) {
    return res.status(400).json({ error: 'idPelicula mal formado' });
  }

  // 3) Verificar que la película exista
  const pelicula = await peliculaCollection().findOne({ _id: new ObjectId(idPelicula) });
  if (!pelicula) {
    return res.status(400).json({ error: 'idPelicula no existe' });
  }

  // 4) Insertar actor
  const r = await actorCollection().insertOne({
    idPelicula: new ObjectId(idPelicula),
    nombre,
    edad,
    estaRetirado,
    premios,
  });

  // 5) Respuesta
  return res.status(201).json({
    _id: r.insertedId,
    idPelicula,
    nombre,
    edad,
    estaRetirado,
    premios,
  });
}

// GET /api/actores
export async function handleGetActoresRequest(_req, res) {
  const items = await actorCollection().find({}).toArray();
  res.json(items);
}

// GET /api/actor/:id
export async function handleGetActorByIdRequest(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'id mal formado' });

  const doc = await actorCollection().findOne({ _id: new ObjectId(id) });
  if (!doc) return res.status(404).json({});

  res.json(doc);
}

// GET /api/actor/pelicula/:idPelicula
export async function handleGetActoresByPeliculaRequest(req, res) {
  const { idPelicula } = req.params;
  if (!ObjectId.isValid(idPelicula)) {
    return res.status(400).json({ error: 'idPelicula mal formado' });
  }

  const items = await actorCollection()
    .find({ idPelicula: new ObjectId(idPelicula) })
    .toArray();

  res.json(items);
}
