/**
 * Application entry point
 */

// Load application styles
import 'styles/index.scss';

//Load App
import AppInit from './App';

// ================================
// START YOUR APP HERE
// ================================
new AppInit(document.querySelector('.js-inputSearch'), document.querySelector('.js-results'));


