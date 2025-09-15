// src/common/actor/routes.js
import { Router } from 'express';

// Si prefieres usar los controladores separados:
import {
  handleGetActorByIdRequest,
  handleGetActoresByPeliculaRequest,
  handleGetActoresRequest,
  handleInsertActorRequest,
} from './controller.js';

const router = Router();

// Rutas requeridas por la prueba
router.post('/actor', handleInsertActorRequest);
router.get('/actores', handleGetActoresRequest);
router.get('/actor/:id', handleGetActorByIdRequest);
router.get('/actor/pelicula/:idPelicula', handleGetActoresByPeliculaRequest);

export default router;
