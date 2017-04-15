import {combineReducers} from 'redux';
import home from './home-reducer';
import portfolio from './portfolio-reducer';


export default combineReducers({
	home,
	portfolio
});