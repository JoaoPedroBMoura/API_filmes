async function buscarFilmes(titulo) {
  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=4a10a0aa&s=${encodeURIComponent(titulo)}`);
    const data = await response.json();
    if (data.Response === "False") {
      return [];
    }
    // Para cada filme na busca, busca os detalhes (para obter o diretor)
    const detalhesPromises = data.Search.map(filme => {
      return fetch(`http://www.omdbapi.com/?apikey=4a10a0aa&i=${filme.imdbID}`)
        .then(res => res.json());
    });
    const detalhesFilmes = await Promise.all(detalhesPromises);
    // Mapeia para um array com somente título, ano e diretor
    const filmesMap = detalhesFilmes.map(f => ({
      Titulo: f.Title,
      Ano: f.Year,
      Diretor: f.Director
    }));
    // Filtra os filmes lançados após 2000
    const filmesFiltrados = filmesMap.filter(f => parseInt(f.Ano) > 2000);
    return filmesFiltrados;
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    return [];
  }
}

function executaBuscaFilmes() {
  const titulo = document.getElementById("titulo-filme").value;
  if (!titulo) {
    alert("Informe um título para buscar.");
    return;
  }
  buscarFilmes(titulo).then(filmes => {
    let html = "";
    if (filmes.length === 0) {
      html = "<p>Nenhum filme encontrado ou nenhum filme após 2000.</p>";
    } else {
      html += "<table><tr><th>Título</th><th>Ano</th><th>Diretor</th></tr>";
      filmes.forEach(f => {
        html += `<tr><td>${f.Titulo}</td><td>${f.Ano}</td><td>${f.Diretor}</td></tr>`;
      });
      html += "</table>";
    }
    document.getElementById("resultado-filmes").innerHTML = html;
  });
}
