// Muuttujat
const omdbApiKey = 'fbb4856c';
const theaterSelect = document.getElementById('theater-select');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const moviesContainer = document.getElementById('movies-container');

// Lataa teatterivaihtoehdot Finnkinon XML:stä
function loadTheaters() {
    fetch('https://www.finnkino.fi/xml/TheatreAreas/')
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
        .then(data => {
            const theaters = data.getElementsByTagName('TheatreArea');
            
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Valitse teatteri';
            theaterSelect.appendChild(defaultOption);

            for (let i = 0; i < theaters.length; i++) {
                const option = document.createElement('option');
                option.value = theaters[i].getElementsByTagName('ID')[0].textContent;
                option.textContent = theaters[i].getElementsByTagName('Name')[0].textContent;
                theaterSelect.appendChild(option);
            }
        })
        .catch(error => {
            console.error('Virhe teattereiden hakemisessa:', error);
            theaterSelect.innerHTML = '<option>Teattereiden haku epäonnistui</option>';
        });
}

// Hae elokuvat valitun teatterin perusteella Finnkinon XML:stä
function fetchMoviesByTheater(theaterId) {
    if (!theaterId) {
        moviesContainer.innerHTML = '<p>Valitse teatteri nähdäksesi elokuvat.</p>';
        return;
    }

    fetch(`https://www.finnkino.fi/xml/Schedule/?area=${theaterId}`)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
        .then(data => {
            const shows = data.getElementsByTagName('Show');
            moviesContainer.innerHTML = '';

            if (shows.length === 0) {
                moviesContainer.innerHTML = '<p>Ei näytöksiä valitussa teatterissa.</p>';
                return;
            }

            for (let i = 0; i < shows.length; i++) {
                const title = shows[i].getElementsByTagName('Title')[0].textContent;
                const imageUrl = shows[i].getElementsByTagName('EventMediumImagePortrait')[0].textContent;
                const startTime = shows[i].getElementsByTagName('dttmShowStart')[0].textContent;

                // Luo elokuvan elementti
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('movie');

                const titleElement = document.createElement('h3');
                titleElement.textContent = title;

                const imageElement = document.createElement('img');
                imageElement.src = imageUrl;
                imageElement.alt = title;

                const timeElement = document.createElement('p');
                timeElement.textContent = `Näytös alkaa: ${new Date(startTime).toLocaleString()}`;

                movieDiv.appendChild(titleElement);
                movieDiv.appendChild(imageElement);
                movieDiv.appendChild(timeElement);
                moviesContainer.appendChild(movieDiv);
            }
        })
        .catch(error => {
            console.error('Virhe elokuvien hakemisessa:', error);
            moviesContainer.innerHTML = '<p>Virhe elokuvien hakemisessa. Tarkista konsoli saadaksesi lisätietoja.</p>';
        });
}

// Hae elokuvat hakutermin perusteella OMDb API:sta
function fetchMovies(searchTerm) {
    if (!searchTerm) {
        moviesContainer.innerHTML = '<p>Anna hakutermi löytääksesi elokuvia.</p>';
        return;
    }

    let apiUrl = `https://www.omdbapi.com/?apikey=${omdbApiKey}&s=${searchTerm}&type=movie`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            moviesContainer.innerHTML = ''; 

            if (data.Search && data.Search.length > 0) {
                data.Search.forEach(movie => {
                    const title = movie.Title;
                    const imageUrl = movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg";

                    const movieDiv = document.createElement('div');
                    movieDiv.classList.add('movie');

                    const titleElement = document.createElement('h3');
                    titleElement.textContent = title;

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

// Event listeners haku- ja teatterivalinnoille
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    const selectedTheater = theaterSelect.value;

    if (selectedTheater) {
        fetchMoviesByTheater(selectedTheater);  // Näytä elokuvat valitun teatterin perusteella
    } else if (searchTerm) {
        fetchMovies(searchTerm);  // Näytä elokuvat hakutermin perusteella
    } else {
        moviesContainer.innerHTML = '<p>Anna hakutermi tai valitse teatteri.</p>';
    }
});

// Alustaa sovelluksen
function init() {
    loadTheaters();
}

init();
