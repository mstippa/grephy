import { combineReducers } from 'redux';
import InputBoxReducer from './reducer_input_box';

const rootReducer = combineReducers({
	input: InputBoxReducer
});

export default rootReducer;
