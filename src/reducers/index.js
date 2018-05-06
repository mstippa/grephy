import { combineReducers } from 'redux';
import InputBoxReducer from './reducer_input_box';
import OutputBoxReducer from './reducer_output_box';
import NFAReducer from './reducer_output_NFA';
import DFAReducer from './reducer_output_DFA';
import AcceptedStateReducer from './reducer_accepted_state';

const rootReducer = combineReducers({
	input: InputBoxReducer,
	acceptedLines : OutputBoxReducer,
	NFA: NFAReducer,
	DFA: DFAReducer,
	acceptedState: AcceptedStateReducer
});

export default rootReducer;
