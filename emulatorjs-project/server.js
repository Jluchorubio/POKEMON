const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

/* =====================
   MIDDLEWARES
===================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'pokemon-secret',
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, 'public')));

/* =====================
   CONEXIÓN MYSQL
===================== */
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'minigestor_pokemon'
});

db.connect(err => {
  if (err) {
    console.error('❌ Error MySQL:', err);
  } else {
    console.log('✅ Conectado a MySQL');
  }
});

/* =====================
   AUTH MIDDLEWARES
===================== */
function authView(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login.html');
  }
  next();
}

function authApi(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
}

/* =====================
   VISTAS (HTML)
===================== */

// HOME
app.get('/', authView, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Pag_principal', 'index.html'));
});

// MIS POKÉMON
app.get('/mis-pokemon', authView, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mis-pokemon.html'));
});

// LOGIN
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT id_usuario, nombre_usuario
    FROM usuario
    WHERE email = ? AND password = ?
  `;

  db.query(sql, [email, password], (err, rows) => {
    if (err) return res.status(500).send('Error servidor');

    if (rows.length === 0) {
      return res.send('Credenciales incorrectas');
    }

    req.session.user = {
      id: rows[0].id_usuario,
      nombre: rows[0].nombre_usuario
    };

    res.redirect('/');
  });
});

// LOGOUT
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

/* =====================
   API (JSON)
===================== */

// NATURALEZAS
app.get('/api/naturalezas', authApi, (req, res) => {
  const sql = `
    SELECT id_naturaleza, nombre_naturaleza
    FROM naturaleza
    ORDER BY nombre_naturaleza
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json([]);
    res.json(rows);
  });
});

// LISTAR POKÉMON
app.get('/api/mis-pokemon', authApi, (req, res) => {
  const sql = `
    SELECT id_pokemon, nombre, imagen_url
    FROM pokemon
    WHERE id_usuario = ?
    ORDER BY id_pokemon DESC
  `;

  db.query(sql, [req.session.user.id], (err, rows) => {
    if (err) return res.json([]);
    res.json(rows);
  });
});

// DETALLE POKÉMON
app.get('/api/pokemon/:id', authApi, (req, res) => {
  const sql = `
    SELECT p.id_pokemon, p.nombre, p.nivel, p.sexo, p.imagen_url,
           n.nombre_naturaleza
    FROM pokemon p
    LEFT JOIN naturaleza n ON p.id_naturaleza = n.id_naturaleza
    WHERE p.id_pokemon = ? AND p.id_usuario = ?
  `;

  db.query(sql, [req.params.id, req.session.user.id], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(404).json({});
    }
    res.json(rows[0]);
  });
});

// CREAR POKÉMON
app.post('/api/pokemon', authApi, (req, res) => {
  const { nombre, nivel, sexo, imagen_url, naturaleza } = req.body;

  // 👉 SIN NATURALEZA
  if (!naturaleza) {
    const sql = `
      INSERT INTO pokemon
      (nombre, nivel, sexo, imagen_url, id_usuario, id_naturaleza)
      VALUES (?, ?, ?, ?, ?, NULL)
    `;

    return db.query(
      sql,
      [nombre, nivel, sexo, imagen_url, req.session.user.id],
      err => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error al guardar');
        }
        res.sendStatus(201);
      }
    );
  }

  // 👉 CON NATURALEZA
  const natSQL = `
    SELECT id_naturaleza
    FROM naturaleza
    WHERE nombre_naturaleza = ?
  `;

  db.query(natSQL, [naturaleza], (err, natRows) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error naturaleza');
    }

    const id_naturaleza = natRows.length ? natRows[0].id_naturaleza : null;

    const sql = `
      INSERT INTO pokemon
      (nombre, nivel, sexo, imagen_url, id_usuario, id_naturaleza)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [nombre, nivel, sexo, imagen_url, req.session.user.id, id_naturaleza],
      err => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error al guardar');
        }
        res.sendStatus(201);
      }
    );
  });
});


// EDITAR POKÉMON
app.put('/api/pokemon/:id', authApi, (req, res) => {
  const { nivel, sexo, naturaleza } = req.body;

  const natSQL = `
    SELECT id_naturaleza
    FROM naturaleza
    WHERE nombre_naturaleza = ?
  `;

  db.query(natSQL, [naturaleza], (err, natRows) => {
    if (err) return res.status(500).send(err);

    const id_naturaleza = natRows.length ? natRows[0].id_naturaleza : null;

    const sql = `
      UPDATE pokemon
      SET nivel = ?, sexo = ?, id_naturaleza = ?
      WHERE id_pokemon = ? AND id_usuario = ?
    `;

    db.query(
      sql,
      [nivel, sexo, id_naturaleza, req.params.id, req.session.user.id],
      err => {
        if (err) return res.status(500).send(err);
        res.sendStatus(200);
      }
    );
  });
});

// ELIMINAR POKÉMON
app.delete('/api/pokemon/:id', authApi, (req, res) => {
  const sql = `
    DELETE FROM pokemon
    WHERE id_pokemon = ? AND id_usuario = ?
  `;

  db.query(sql, [req.params.id, req.session.user.id], err => {
    if (err) return res.status(500).send('Error');
    res.sendStatus(200);
  });
});

/* =====================
   SERVIDOR
===================== */
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
