import React, { Fragment, useReducer, useEffect } from 'react';
import axios from 'axios';
import {
	BrowserRouter as Router,
	Switch,
	Redirect,
	Route,
} from 'react-router-dom';
import { toast } from 'react-toastify';

import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const initialState = {
	isAuthenticated: false,
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'LOGIN':
			return { ...state, isAuthenticated: true };
		case 'LOGOUT':
			return { ...state, isAuthenticated: false };
		default:
			throw new Error();
	}
};

toast.configure()

const App = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	useEffect(() => {
		isAuth();
	}, []);

	const isAuth = async () => {
		try {
			const res = await axios.get('http://localhost:8080/auth/verify', {
				headers: { jwt_token: localStorage.jwt_token },
			});
			res.data ? dispatch({ type: 'LOGIN' }) : dispatch({ type: 'LOGOUT' });
		} catch (error) {
			console.log(error.message);
		}
	};
	return (
		<Fragment>
			<Router>
				<div className='container'>
					<Switch>
						<Route
							exact
							path='/login'
							render={props =>
								!state.isAuthenticated ? (
									<Login
										{...props}
										setAuth={(value) => dispatch({ type: value })}
									/>
								) : (
										<Redirect to='/dashboard' />
									)
							}
						/>
						<Route
							exact
							path='/register'
							render={props =>
								!state.isAuthenticated ? (
									<Register
										{...props}
										setAuth={(value) => dispatch({ type: value })}
									/>
								) : (
										<Redirect to='/login' />
									)
							}
						/>
						<Route
							exact
							path='/dashboard'
							render={props =>
								state.isAuthenticated ? (
									<Dashboard
										{...props}
										setAuth={() => dispatch({ type: 'LOGOUT' })}
									/>
								) : (
										<Redirect to='/login' />
									)
							}
						/>
					</Switch>
				</div>
			</Router>
		</Fragment>
	);
};

export default App;
