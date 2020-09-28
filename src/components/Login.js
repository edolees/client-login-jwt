import React, { Fragment, useReducer } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const inputs = {
	email: '',
	password: '',
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'ONCHANGE':
			return { ...state, [action.name]: action.value };
		default:
			throw new Error();
	}
};

const Login = props => {
	const [state, dispatch] = useReducer(reducer, inputs);

	const { email, password } = state;

	const inputHandler = e => {
		dispatch({ type: 'ONCHANGE', name: e.target.name, value: e.target.value });
	};

	const submitHandler = async e => {
		e.preventDefault();
		const body = { email, password };
		try {
			const res = await axios.post('http://localhost:8080/auth/login', body)
			if (res.data.token) {
				localStorage.setItem('jwt_token', res.data.token);
				props.setAuth('LOGIN');
				toast.success('Login Success')
			}

		} catch (error) {
			console.error(error.response);
			props.setAuth('LOGOUT');
			toast.error(error.response.data)
		}
	};

	return (
		<Fragment>
			<h1>Login</h1>
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
				<Button variant='success' type='submit' size='lg' block>
					Submit
				</Button>
			</Form>
			<Link to='/register'>Sign up?</Link>
		</Fragment>
	);
};

export default Login;
