// Maneja la conexión y entrega colecciones
import 'dotenv/config';

import { MongoClient } from 'mongodb';

let client;
let db;

export async function connectToMongo() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'cine-db';
  if (!uri) throw new Error('Falta MONGODB_URI en .env');

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);

  console.log(`✅ Conectado a Atlas -> ${db.databaseName}`);
  return db;
}

export function getDb() {
  if (!db) throw new Error('DB no inicializada. Llama a connectToMongo() primero.');
  return db;
}

// Atajos de colecciones que usaremos
export const peliculaCollection = () => getDb().collection('pelicula');
export const actorCollection    = () => getDb().collection('actor');

