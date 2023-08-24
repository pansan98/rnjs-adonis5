import React from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

import Config from '../../config'

import Loader from '../common/Loader'
import PageLoader from '../common/PageLoader'
import Text from '../forms/Text'
import Error from '../forms/Error'

class Register extends React.Component {
	constructor(props)
	{
		super(props);
		this.state = {
			username: '',
			login_id: '',
			password: '',
			password_confirmation: '',
			email: '',
			errors: {
				username: [],
				login_id: [],
				password: [],
				password_confirmation: [],
				email: [],
				system: []
			},
			registered: false,
			loading: false
		}
	}

	handlerChange(name, value)
	{
		const param = {}
		param[name] = value
		this.setState(param)
	}

	async onSave(e)
	{
		e.preventDefault();
		this.setState({loading: true});
		await axios.post(Config.api.auth.register, {
			username: this.state.username,
			login_id: this.state.login_id,
			password: this.state.password,
			password_confirmation: this.state.password_confirmation,
			email: this.state.email,
			credentials: 'same-origin'
		}).then((res) => {
			console.log(res)
			if(res.data.result) {
				this.setState({registered: true})
			}
			return;
		}).catch((e) => {
			if(e.response.status === 400) {
				this.setState({errors: e.response.data.errors})
			} else {
				this.setState({errors: {
					system: e.response.data.error.message
				}})
			}
		}).finally(() => {
			this.setState({loading: false})
		})
	}

	register_display()
	{
		if(!this.state.registered) {
			return (
				<div className="card-body">
					<Error
						error={this.state.errors.system}
					/>
					<p className="login-box-msg">Sign in to start sessions</p>
					<Text
						formName="username"
						type="text"
						label="Nick Name"
						value={this.state.username}
						onChange={(name, value) => this.handlerChange(name, value)}
					/>
					<Error
						error={this.state.errors.username}
					/>
					<Text
						formName="login_id"
						type="text"
						label="Login ID"
						value={this.state.login_id}
						onChange={(name, value) => this.handlerChange(name, value)}
					/>
					<Error
						error={this.state.errors.login_id}
					/>
					<Text
						formName="password"
						type="password"
						label="Password"
						value={this.state.password}
						onChange={(name, value) => this.handlerChange(name, value)}
					/>
					<Error
						error={this.state.errors.password}
					/>
					<Text
						formName="password_confirmation"
						type="password"
						label="Password ReTry"
						value={this.state.password_confirmation}
						onChange={(name, value) => this.handlerChange(name, value)}
					/>
					<Error
						error={this.state.errors.password_confirmation}
					/>
					<Text
						formName="email"
						type="email"
						label="Email"
						value={this.state.email}
						onChange={(name, value) => this.handlerChange(name, value)}
					/>
					<Error
						error={this.state.errors.email}
					/>
					<div className="col-4">
						<button type="submit" className="btn btn-primary btn-block" onClick={(e) => this.onSave(e)}>Register</button>
					</div>
					<p className="mb-0">
						<Link to="/auth/login" className="text-center">Login</Link>
					</p>
				</div>
			)
		} else {
			return (
				<div className="card-body">
					<p className="text-center">登録が完了しました。<br/>ログインページでログインしてください。</p>
					<p className="mb-0">
						<Link to="/auth/login" className="text-center">Login</Link>
					</p>
				</div>
			)
		}
	}

	render()
	{
		return (
			<div className="register-page">
				<Loader
					is_loading={this.state.loading}
				/>
				<div className="register-box">
					<PageLoader />
					<div className="card">
						{this.register_display()}
					</div>
				</div>
			</div>
		)
	}
}

export default Register