// OMDB API -avain
const omdbApiKey = 'fbb4856c';

// Muuttujat
const yearSelect = document.getElementById('year-select');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const moviesContainer = document.getElementById('movies-container');

// Lataa julkaisuvuosivaihtoehdot (1900-nykyinen vuosi)
function loadYears() {
    const startYear = 1900;
    const endYear = new Date().getFullYear();

    // Lisää oletusarvo "Kaikki vuodet" dropdowniin
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Kaikki vuodet';
    yearSelect.appendChild(defaultOption);

    for (let year = endYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Hae elokuvat hakutermin ja valinnaisen vuoden perusteella
function fetchMovies(searchTerm, selectedYear) {
    // Tarkistetaan, että hakutermi on annettu
    if (!searchTerm) {
        moviesContainer.innerHTML = '<p>Anna hakutermi löytääksesi elokuvia.</p>';
        return;
    }

    // Rakennetaan API URL
    let apiUrl = `https://www.omdbapi.com/?apikey=${omdbApiKey}&s=${searchTerm}&type=movie`;
    if (selectedYear) {
        apiUrl += `&y=${selectedYear}`;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("API-vastaus:", data); // Vastaustiedot konsoliin virheenkorjausta varten
            moviesContainer.innerHTML = ''; // Tyhjennetään aikaisemmat elokuvainformaatiot

            if (data.Search && data.Search.length > 0) {
                data.Search.forEach(movie => {
                    const title = movie.Title;
                    const imageUrl = movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"; // Paikkamerkki jos kuvaa ei ole
                    const year = movie.Year;

                    // Luo elokuvan elementti
                    const movieDiv = document.createElement('div');
                    movieDiv.classList.add('movie');

                    const titleElement = document.createElement('h3');
                    titleElement.textContent = `${title} (${year})`;

                    const imageElement = document.createElement('img');
                    imageElement.src = imageUrl;
                    imageElement.alt = title;

                    movieDiv.appendChild(titleElement);
                    movieDiv.appendChild(imageElement);
                    moviesContainer.appendChild(movieDiv);
                });
            } else {
                moviesContainer.innerHTML = '<p>Elokuvia ei löytynyt.</p>';
            }
        })
        .catch(error => {
            console.error('Virhe elokuvien hakemisessa:', error);
            moviesContainer.innerHTML = '<p>Virhe elokuvien hakemisessa. Tarkista konsoli saadaksesi lisätietoja.</p>';
        });
}

// Haku- ja vuosi-valinta
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    const selectedYear = yearSelect.value;

    // Tarkistetaan, että on annettu hakutermi
    if (searchTerm || selectedYear) {
        fetchMovies(searchTerm, selectedYear);
    } else {
        moviesContainer.innerHTML = '<p>Anna elokuvan nimi hakukenttään tai valitse vuosi.</p>';
    }
});

// Alustaa sovelluksen
function init() {
    loadYears();
}

init();
