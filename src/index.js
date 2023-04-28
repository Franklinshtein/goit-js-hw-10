import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from '../fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


searchBox.addEventListener('input', debounce(inputCounty, DEBOUNCE_DELAY));

function inputCounty(){
  const name = searchBox.value.trim();
  if (name === ''){
    countryList.innerHTML = '';
    countryInfo.innerHTML= '';
    return;
  }

  fetchCountries(name)
  .then(country => {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    if(country.length === 1){
      countryInfo.insertAdjacentHTML('beforeend',markupCountryInfo(country));
    } else if (country.length >= 10) {
      toManyAlert();
    } else {
      countryList.insertAdjacentHTML('beforeend',markupCountryList(country));
    }
  })
  .catch(wrongNameAlert);
}

function toManyAlert(){
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}

function wrongNameAlert(){
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function markupCountryList (country){
  const renderCountryList = country.map(({name, flags}) => {
    const layout = `
    <li class='country_list'>
      <img class='country_list--flag' src='${flags.svg}' alt='Flag of ${name.official}'>
      <h2 class='country_list--name'>${name.official}</h2>
    </li>
    `;
    return layout;
  })
  .join('');
  return renderCountryList;
}

function markupCountryInfo(country) {
  const renderCountryInfo = country
    .map(({name, flags, capital, population, languages}) => {
      const layout = `
        <ul class='country_info'>
          <li class='country_info--item'>
            <img class='country_info--flag' src='${flags.svg}' alt='Flag of ${name.official}'>
            <h2 class='country_info--name'>${name.official}</h2>
          </li>
          <li class='country_info--item'>Capital: ${capital}</li>
          <li class='country_info--item'>Population: ${population}</li>
          <li class='country_info--item'>Languages: ${Object.values(languages)}</li>
        </ul>
      `;
      return layout;
    })
    .join('');
  return renderCountryInfo;
}