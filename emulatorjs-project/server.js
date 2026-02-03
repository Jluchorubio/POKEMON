const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

/* =====================
   MIDDLEWARES
===================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'pokemon-secret',
  resave: false,
  saveUninitialized: false
}));

// Archivos estáticos
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
    console.error('Error MySQL:', err);
  } else {
    console.log('Conectado a MySQL');
  }
});

/* =====================
   MIDDLEWARE DE AUTENTICACIÓN
===================== */
function auth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login.html');
  }
  next();
}

/* =====================
   RUTAS
===================== */

// HOME
app.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login.html');
  }

  res.sendFile(path.join(__dirname, 'public', 'Pag_principal', 'index.html'));
});


// LOGIN
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT id_usuario, nombre_usuario
    FROM usuario
    WHERE email = ? AND password = ?
  `;

  db.query(sql, [email, password], (err, results) => {
    if (err) return res.send('Error en servidor');

    if (results.length > 0) {
      req.session.user = {
        id: results[0].id_usuario,
        nombre: results[0].nombre_usuario
      };
      res.redirect('/');
    } else {
      res.send('Credenciales incorrectas');
    }
  });
});

// PÁGINA TUS POKÉMON
app.get('/mis-pokemon', auth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mis-pokemon.html'));
});

// API: LISTAR POKÉMON DEL USUARIO
app.get('/api/mis-pokemon', auth, (req, res) => {
  const idUsuario = req.session.user.id;

  const sql = `
    SELECT nombre, nivel, sexo
    FROM pokemon
    WHERE id_usuario = ?
  `;

  db.query(sql, [idUsuario], (err, results) => {
    if (err) return res.json([]);
    res.json(results);
  });
});

// LOGOUT
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

/* =====================
   SERVIDOR
===================== */
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get('/test-db', (req, res) => {
  db.query('SELECT * FROM usuario', (err, results) => {
    if (err) return res.send('Error en la consulta');
    res.json(results);
  });
});
