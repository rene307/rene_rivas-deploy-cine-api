// src/pelicula/controller.js
import { ObjectId } from 'mongodb';

import { peliculaCollection } from '../common/db.js';
import { validatePelicula } from './pelicula.js';

// POST /pelicula
export async function handleInsertPeliculaRequest(req, res) {
  const error = validatePelicula(req.body);
  if (error) return res.status(400).json({ error });

  const { nombre, generos, anioEstreno } = req.body;
  const r = await peliculaCollection().insertOne({ nombre, generos, anioEstreno });
  return res.status(201).json({ _id: r.insertedId, nombre, generos, anioEstreno });
}

// GET /peliculas
export async function handleGetPeliculasRequest(_req, res) {
  const items = await peliculaCollection().find({}).toArray();
  res.json(items);
}

// GET /pelicula/:id
export async function handleGetPeliculaByIdRequest(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'id mal formado' });

  const doc = await peliculaCollection().findOne({ _id: new ObjectId(id) });
  if (!doc) return res.status(404).json({});
  res.json(doc);
}

// PUT /pelicula/:id  (usa $set)
export async function handleUpdatePeliculaByIdRequest(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'id mal formado' });

  const error = validatePelicula(req.body);
  if (error) return res.status(400).json({ error });

  const { nombre, generos, anioEstreno } = req.body;
  const r = await peliculaCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: { nombre, generos, anioEstreno } }
  );
  if (r.matchedCount === 0) return res.status(404).json({});
  res.json({ ok: true });
}

// DELETE /pelicula/:id
export async function handleDeletePeliculaByIdRequest(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'id mal formado' });

  const r = await peliculaCollection().deleteOne({ _id: new ObjectId(id) });
  if (r.deletedCount === 0) return res.status(404).json({});
  res.json({ ok: true });
}
