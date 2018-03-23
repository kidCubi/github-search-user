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
new SearchGithubUser(document.querySelector('.js-inputSearch'), document.querySelector('.js-results'));


