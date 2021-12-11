import axios from 'axios';
// import { setAlert } from "./alert.js";
import {
    REGISTER_FAILURE,
    REGISTER_SUCCESS,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    LOGOUT
} from './Types'



export const register = ({name, email, password}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type':'application/json'
        }
    }

    const body = JSON.stringify({name, email, password});

    try {
        console.log(body);

        const res = await axios.post('http://localhost:5000/register', body, config);
        console.log('res',res);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res
        });
    } catch (err) {
        if(err){
            console.log(err);
        }

        // const errors = err.response.data.errors;
        // if(errors){
        //     // errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        //     console.log(errors);
        // }
        dispatch({
            type: REGISTER_FAILURE
        });
    }
}

//LOGIN USER

export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({email, password});

    try {
        console.log(body);
        // console.log('in actions');
        const res = await axios.post('http://localhost:5000/login', body, config);
        console.log('in actions', res)
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res
        });
    } catch (err) {

        dispatch({
            type: LOGIN_FAILURE
        });
    }
}


// logout action and clear profiles

export const logout = () => dispatch => {
    dispatch({ type: LOGOUT})
};

