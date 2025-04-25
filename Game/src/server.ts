import fastify, { FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import sqlite3 from "sqlite3";


const app: FastifyInstance = fastify({ logger: true });

app.get("/hello", async (request, reply) => {
  reply.send({ hello: "world modified" });
});

// Serve static files (including canvas.js) from /public
app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/',
});


/**
 *
 *   DATATABASE TEST
 *
 */


const db = new sqlite3.Database(path.join(__dirname, '../db/data.sqlite'), (err) => {
  if (err) {
    console.error('Failed to open database', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

db.run(
  `CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`
);

app.get('/api/visit', async () =>
  new Promise((resolve, reject) => {
    db.run('INSERT INTO visits DEFAULT VALUES', function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  })
);

app.get('/api/visits', async () =>
  new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) AS count FROM visits', (err, row: { count: number }) => {
      if (err) return reject(err);
      resolve({ visits: row.count });
    });
  })
);

/***
 *
 *  END OF DATABASE TEST
 *
 */


const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log('Server running on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();


