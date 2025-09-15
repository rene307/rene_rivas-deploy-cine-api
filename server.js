// server.js
import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import actorRoutes from './src/common/actor/routes.js';
import {
  connectToMongo,
  peliculaCollection,
} from './src/common/db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Home
app.get('/', (_req, res) => res.send('Bienvenido al cine Iplacex'));

// Películas (pruebas)
app.get('/api/peliculas', async (_req, res) => {
  try {
    const items = await peliculaCollection().find({}).toArray();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/pelicula', async (req, res) => {
  try {
    const { nombre, generos, anioEstreno } = req.body || {};
    if (!nombre || !Array.isArray(generos) || !Number.isInteger(anioEstreno)) {
      return res
        .status(400)
        .json({ error: 'nombre(string), generos(array), anioEstreno(int)' });
    }
    const r = await peliculaCollection().insertOne({ nombre, generos, anioEstreno });
    res.status(201).json({ _id: r.insertedId, nombre, generos, anioEstreno });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Actor: monta todas las rutas bajo /api
app.use('/api', actorRoutes);

// 404 genérico (opcional)
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

const PORT = 4000 || 3000; // cambio de puerto a 4000 no el de adaptarse a cualquiera.

// Arranca solo si conecta a Atlas
try {
  await connectToMongo();
  app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
} catch (e) {
  console.error('❌ No se pudo conectar a MongoDB Atlas:', e.message);
  process.exit(1);
}

