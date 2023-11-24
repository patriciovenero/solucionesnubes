# Importar las bibliotecas necesarias
from flask import Flask, jsonify  # Flask para construir la aplicación web y jsonify para devolver respuestas JSON
import pandas as pd  # Pandas para el manejo de datos
from redis import Redis  # Redis para la caché

# Crear una instancia de la aplicación Flask
app = Flask(__name__)

# Conectar a Redis (utilizado como caché)
redis = Redis(host='redis', port=6379)

# Cargar datos desde archivos CSV y almacenarlos en DataFrames
movies = pd.read_csv('movies.csv')  # DataFrame para películas
ratings = pd.read_csv('ratings.csv')  # DataFrame para clasificaciones (ratings)

# Definir la ruta principal que proporciona un mensaje de uso
@app.route("/")
def index():
    return "Usage: http://<hostname>[:<prt>]/api/movies"

# Definir la ruta para obtener información sobre películas
@app.route("/api/movies")
def get_movies():
    # Verificar si los datos están en la caché de Redis
    cached_data = redis.get('movies_data')
    if cached_data:
        # Si está en caché, devolver los datos en formato JSON
        return jsonify(eval(cached_data))

    # Si no está en caché, convertir los datos a JSON y almacenarlos en caché con un tiempo de espera de 60 segundos
    data = movies.to_dict(orient='records')
    redis.setex('movies_data', 60, str(data))

    # Devolver los datos en formato JSON
    return jsonify(data)

# Definir la ruta para obtener información sobre clasificaciones (ratings)
@app.route("/api/ratings")
def get_ratings():
    # Verificar si los datos están en la caché de Redis
    cached_data = redis.get('ratings_data')
    if cached_data:
        # Si está en caché, devolver los datos en formato JSON
        return jsonify(eval(cached_data))

    # Si no está en caché, convertir los datos a JSON y almacenarlos en caché con un tiempo de espera de 60 segundos
    data = ratings.to_dict(orient='records')
    redis.setex('ratings_data', 60, str(data))

    # Devolver los datos en formato JSON
    return jsonify(data)

# Definir la ruta para obtener las mejores clasificaciones (top 10)
@app.route("/api/best_ratings")
def get_best_ratings():
    # Obtener las mejores películas por clasificación (ejemplo: top 10)
    top_ratings = ratings.nlargest(10, 'rating')

    # Convertir los datos a JSON
    data = top_ratings.to_dict(orient='records')

    # Devolver los datos en formato JSON
    return jsonify(data)

# Iniciar la aplicación Flask cuando el script se ejecuta directamente
if __name__ == "__main__":
    app.run(host="0.0.0.0")
