import './css/styles.css';
import { fetchCountries }  from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;


const inputEl = document.querySelector("#search-box");
const listEl = document.querySelector(".country-list");
const infoEl = document.querySelector(".country-info");

inputEl.addEventListener('input', debounce(findCountry, DEBOUNCE_DELAY));

function findCountry(e) {
    e.preventDefault();
    const inputValue = e.target.value.trim();
    
    if(inputValue.length === 0){
      Notiflix.Notify.info('Please, start entering country name');
      return;
    }

    fetchCountries(inputValue)
    .then(renderCountry)
    .catch(error => {
        Notiflix.Notify.failure("Oops, there is no country with that name");
        infoEl.innerHTML = '';
        listEl.innerHTML = '';
        return error;
    });
}

function renderCountry(country) {
    listEl.innerHTML = country
    .map(
      ({name:{official}, flags:{svg}}) => 
        `
        <li class="country"><img src="${svg}"alt="Flag of ${official}" />
        <h1>${official}</h1>
        </li>
        `
    ).join("");

    if (country.length === 1) {
        infoEl.innerHTML = country
          .map(
            ({capital, population, languages}) =>
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