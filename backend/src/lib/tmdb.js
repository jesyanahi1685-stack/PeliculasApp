const API_KEY = "3e3b3526bc165ec1039a8b585abc7ab8";

async function obtenerPeliculas() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-MX`
    );

    if (!response.ok) {
      throw new Error("Error en la API");
    }

    const data = await response.json();
    return data.results;

  } catch (error) {
    console.error("Error TMDb:", error);
    return [];
  }
}

module.exports = { obtenerPeliculas }; // fix export
