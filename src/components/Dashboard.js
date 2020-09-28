import React, { Fragment, useReducer, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
const initialState = {
	username: '',
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'GETNAME':
			return { username: action.value };
		default:
			throw new Error();
	}
};

const Dashboard = props => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { username } = state;

	const getName = async () => {
		try {
			const res = await axios.get('http://localhost:8080/dashboard', {
				headers: { jwt_token: localStorage.jwt_token },
			});
			dispatch({ type: 'GETNAME', value: res.data.username });
		} catch (error) {
			console.log(error.message);
		}
	};

	const logoutHandler = e => {
		e.preventDefault();
		localStorage.removeItem('jwt_token');
		props.setAuth();
		toast.success('Logged Out Successfully');
	};

	useEffect(() => {
		getName();
	}, []);
	return (
		<Fragment>
			<h1>Dashboard {username}</h1>
			<Button onClick={e => logoutHandler(e)}>Logout</Button>
		</Fragment>
	);
};

export default Dashboard;
