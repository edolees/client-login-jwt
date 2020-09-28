import React, { Fragment, useReducer } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import axios from 'axios';

const inputs = {
	email: '',
	password: '',
	username: '',
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'ONCHANGE':
			return { ...state, [action.name]: action.value };
		default:
			throw new Error();
	}
};

const Register = props => {
	const [state, dispatch] = useReducer(reducer, inputs);

	const { email, password, username } = state;

	const inputHandler = e => {
		dispatch({ type: 'ONCHANGE', name: e.target.name, value: e.target.value });
	};

	const submitHandler = async e => {
		e.preventDefault();
		const body = { email, password, username };
		try {
			const res = await axios.post('http://localhost:8080/auth/register', body);
			if (res.data.token) {
				localStorage.setItem('jwt_token', res.data.token);
				props.setAuth('LOGIN');
				toast.success('Registered Successfully')
			}
		} catch (error) {
			console.error(error.response);
			props.setAuth('LOGOUT');
			toast.error(error.response.data)
		}
	};
	return (
		<Fragment>
			<h1>Register</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group controlId='formBasicEmail'>
					<Form.Label>Email address</Form.Label>
					<Form.Control
						type='email'
						name='email'
						placeholder='Enter email'
						value={email}
						onChange={e => inputHandler(e)}
					/>
				</Form.Group>

				<Form.Group controlId='formBasicPassword'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='password'
						name='password'
						placeholder='********'
						value={password}
						onChange={e => inputHandler(e)}
					/>
				</Form.Group>
				<Form.Group controlId='formBasicUsername'>
					<Form.Label>Username</Form.Label>
					<Form.Control
						type='text'
						name='username'
						placeholder='Example95'
						value={username}
						onChange={e => inputHandler(e)}
					/>
				</Form.Group>
				<Button variant='success' type='submit' size='lg' block>
					Submit
				</Button>
			</Form>
			<Link to='/login'>Sign in?</Link>
		</Fragment>
	);
};

export default Register;
