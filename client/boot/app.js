// Initialize polyfills before any dependencies are loaded
import './polyfills';

/**
 * External dependencies
 */
import debugFactory from 'debug';
import page from 'page';

/**
 * Internal dependencies
 */
import { configureReduxStore, setupMiddlewares, utils } from './common';
import { setupLocale } from './locale';
import { createReduxStore } from 'state';
import initialReducer from 'state/reducer';
import { getInitialState, persistOnChange, loadAllState } from 'state/initial-state';
import detectHistoryNavigation from 'lib/detect-history-navigation';
import userFactory from 'lib/user';

/**
 * Style dependencies
 */
import 'assets/stylesheets/style.scss';

const debug = debugFactory( 'calypso' );

const boot = currentUser => {
	debug( "Starting Calypso. Let's do this." );

	utils();
	loadAllState().then( () => {
		const initialState = getInitialState( initialReducer );
		const reduxStore = createReduxStore( initialState, initialReducer );
		persistOnChange( reduxStore );
		setupLocale( currentUser.get(), reduxStore );
		configureReduxStore( currentUser, reduxStore );
		setupMiddlewares( currentUser, reduxStore );
		detectHistoryNavigation.start();
		page.start( { decodeURLComponents: false } );
	} );
};

window.AppBoot = () => {
	const user = userFactory();
	user.initialize().then( () => boot( user ) );
};
