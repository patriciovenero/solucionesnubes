const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3001;

// Configurar el motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ruta para la página principal
app.get('/', async (req, res) => {
  try {
    // Hacer una solicitud a la API Flask utilizando el nombre del servicio del backend
    const moviesResponse = await axios.get('http://backend:5000/api/movies');
    const ratingsResponse = await axios.get('http://backend:5000/api/ratings');

    // Renderizar la página principal con los datos
    res.render('index', {
      movies: moviesResponse.data,
      ratings: ratingsResponse.data
    });
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).send('Error al obtener datos.');
  }
});

// Ruta para la página de películas
app.get('/movies', async (req, res) => {
  try {
    // Hacer una solicitud a la API Flask solo para películas
    const moviesResponse = await axios.get('http://backend:5000/api/movies');

    // Renderizar la página de películas con los datos
    res.render('movies', { movies: moviesResponse.data });
  } catch (error) {
    console.error('Error al obtener datos de películas:', error);
    res.status(500).send('Error al obtener datos de películas.');
  }
});

// Ruta para la página de categoría comedia
app.get('/categoriacomedia', async (req, res) => {
  try {
    // Hacer una solicitud a la API Flask solo para películas de comedia
    const categoResponse = await axios.get('http://backend:5000/api/ratings');
    

    // Realizar análisis de ratings y timestamps
    const ratings = categoResponse.data;
    const topRatings = ratings.sort((a, b) => b.rating - a.rating).slice(0, 10);
    const topTimestamps = ratings.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

    // Renderizar la página de categoría comedia con los datos
    res.render('categoriacomedia', { comedias: categoResponse.data, topRatings, topTimestamps });
  } catch (error) {
    console.error('Error al obtener datos de películas de comedia:', error);
    res.status(500).send('Error al obtener datos de películas de comedia.', error);
  }
});

// Ruta para la página de calificaciones
app.get('/ratings', async (req, res) => {
  try {
    // Hacer una solicitud a la API Flask solo para calificaciones
    const ratingsResponse = await axios.get('http://backend:5000/api/ratings');

    // Renderizar la página de calificaciones con los datos
    res.render('ratings', { ratings: ratingsResponse.data });
  } catch (error) {
    console.error('Error al obtener datos de calificaciones:', error);
    res.status(500).send('Error al obtener datos de calificaciones.');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor frontend Node.js iniciado en http://localhost:${port}`);
});