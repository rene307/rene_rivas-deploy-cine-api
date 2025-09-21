// server.js
import 'dotenv/config';

import cors from 'cors';
import express from 'express';

// Si tienes estos módulos y BD disponible, los usaremos.
// Si no, el servidor arrancará en modo memoria.
let dbDisponible = !!process.env.MONGODB_URI;
let connectToMongo, peliculaCollection, actorRoutes;

if (dbDisponible) {
  try {
    const dbMod = await import('./src/common/db.js');
    connectToMongo = dbMod.connectToMongo;
    peliculaCollection = dbMod.peliculaCollection;
    const routesMod = await import('./src/common/actor/routes.js');
    actorRoutes = routesMod.default;
  } catch {
    // Si los módulos no existen o fallan, seguimos en memoria.
    dbDisponible = false;
  }
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) =>
  res.send('API REST Express para administración de películas favoritas de empleados de IPLACEX')
);

// ---- RUTAS PELÍCULAS ----
let memPeliculas = [
  { _id: '1', nombre: 'Inception', generos: ['Sci-Fi'], anioEstreno: 2010 },
  { _id: '2', nombre: 'The Matrix', generos: ['Sci-Fi', 'Action'], anioEstreno: 1999 }
];

app.get('/api/peliculas', async (_req, res) => {
  try {
    if (dbDisponible) {
      const items = await peliculaCollection().find({}).toArray();
      return res.json(items);
    }
    return res.json(memPeliculas);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/pelicula', async (req, res) => {
  try {
    const { nombre, generos, anioEstreno } = req.body || {};
    if (!nombre || !Array.isArray(generos) || !Number.isInteger(anioEstreno)) {
      return res.status(400).json({ error: 'nombre(string), generos(array), anioEstreno(int)' });
    }

    if (dbDisponible) {
      const r = await peliculaCollection().insertOne({ nombre, generos, anioEstreno });
      return res.status(201).json({ _id: r.insertedId, nombre, generos, anioEstreno });
    }

    const nuevo = { _id: String(Date.now()), nombre, generos, anioEstreno };
    memPeliculas.push(nuevo);
    return res.status(201).json(nuevo);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---- RUTAS ACTOR (solo si hay BD) ----
if (dbDisponible && actorRoutes) {
  app.use('/api', actorRoutes);
}

// 404 genérico
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// PORT correcto para Render
const PORT = process.env.PORT || 4000;

// Arranque con fallback a memoria
async function start() {
  if (dbDisponible) {
    try {
      await connectToMongo();
      console.log('✅ Conectado a MongoDB Atlas');
    } catch (e) {
      console.warn('⚠️ No se pudo conectar a MongoDB Atlas. Iniciando en modo memoria.', e.message);
      dbDisponible = false;
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en puerto ${PORT} (modo ${dbDisponible ? 'BD' : 'memoria'})`);
  });
}
start();


