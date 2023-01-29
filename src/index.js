import './css/styles.css';
import fetchCountries from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;


const inputEl = document.querySelector("#search-box");
const listEl = document.querySelector(".country-list");
const infoEl = document.querySelector(".country-info");

inputEl.addEventListener("inputEl", debounce(onFetchCountry, DEBOUNCE_DELAY));

function onFetchCountry(e) {
    e.preventDefault();
    const searchQuery = e.target.value.trim();
    
    if(searchQuery.length === 0){
      Notiflix.Notify.info('Please, start entering country name');
      return;
    }

    fetchCountries(searchQuery)
    .then(renderCountry)
    .catch(error => {
        Notiflix.Notify.failure("Oops, there is no country with that name");
        infoEl.innerHTML = '';
        listEl.innerHTML = '';
        return error;
    });
}

function renderCountry(country) {
    const markup = country.map(({name:{official}, flags:{svg}}) => {
        return `<li><img src="${svg} alt="Flag of ${official}" />
        <h1>${official}</h1>
        </li>`
    }).join("");
    listEl.innerHTML = markup;

    if (country.length === 1) {
        infoEl.innerHTML = country
          .map(
            ({capital,population, languages}) =>
              `
              <p><b>Capital: </b>${capital}</p>
              <p><b>Population: </b>${population}</p>
              <p><b>Languages: </b>${Object.values(languages)}</p>
             `
          )
          .join('');
          document.querySelector('.country').classList.add('single');
          return; 
    }
    
      if (country.length > 10) {
        listEl.innerHTML = '';
        Notiflix.Notify.warning('Too many matches found. Please enter a more specific name');
      }
    
      infoEl.innerHTML = '';
}