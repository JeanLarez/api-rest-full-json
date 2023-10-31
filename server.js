// Cargar las variables de entorno del archivo .env
require("dotenv").config();

// Importar el módulo Express
const express = require("express");
const app = express();

// Importar las funciones del gestor de frutas
const { leerFrutas, guardarFrutas } = require("./src/frutasManager");

// Configurar el número de puerto para el servidor
const PORT = process.env.PORT || 3008;

// Crear un arreglo vacío para almacenar los datos de las frutas
let BD = [];

// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware para leer los datos de las frutas antes de cada solicitud
app.use((req, res, next) => {
  BD = leerFrutas(); // Leer los datos de las frutas desde el archivo
  next(); // Pasar al siguiente middleware o ruta
});


// Ruta principal que devuelve los datos de las frutas
app.get("/", (req, res) => {
  res.send(BD);
});

// Ruta para agregar una nueva fruta al arreglo y guardar los cambios
app.post("/", (req, res) => {
  const nuevaFruta = req.body;
  BD.push(nuevaFruta); // Agregar la nueva fruta al arreglo
  guardarFrutas(BD); // Guardar los cambios en el archivo
  res.status(201).send("Fruta agregada!"); // Enviar una respuesta exitosa
});

app.get("/id/:id", (req, res) => {
  const idFruta = parseInt(req.params.id);
  const producto = BD.find((element) => element.id === idFruta);
  producto
    ? res.status(200).json(producto)
    : res.status(404).json({ message: "No se encontro el Producto" });
});

app.put("/id/:id", (req, res) => {
  const idFruta = parseInt(req.params.id);
  const nuevosDatos = req.body
  const producto = BD.find((element) => element.id === idFruta);
  if (producto) {
    BD[producto.id] = nuevosDatos;
    guardarFrutas(BD);
    res.status(202).send(nuevosDatos);
  } else {
    res.status(404).json({ message: "No se encontro el Producto" });
  }
});

app.delete("/id/:id", (req, res) => {
  const idFruta = parseInt(req.params.id);
  const producto = BD.find((element) => element.id === idFruta);
  if (producto) {
    BD.splice(idFruta - 1, 1);
    guardarFrutas(BD);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "No se encontro el Producto" });
  }
});

// Ruta para manejar las solicitudes a rutas no existentes
app.get("*", (req, res) => {
  res.status(404).send("Lo sentimos, la página que buscas no existe.");
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
