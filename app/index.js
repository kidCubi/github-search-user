/**
 * Application entry point
 */

// Load application styles
import 'styles/index.scss';

//Load App
import SearchGithubUser from './App';

// ================================
// START YOUR APP HERE
// ================================
new SearchGithubUser({
    input: document.querySelector('.js-inputSearch'),
    resultsContainer: document.querySelector('.js-results'),
    searchTitle: "Github users"
});


