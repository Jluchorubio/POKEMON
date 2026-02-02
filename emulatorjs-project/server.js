const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir todo el contenido de "public"
app.use(express.static(path.join(__dirname, 'public')));

// Redirigir raíz al menú principal dentro de Pag_principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Pag_principal', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

