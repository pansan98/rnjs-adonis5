import React from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'

import Loader from '../common/Loader'
import Base from './Base'
import Config from '../../config'
import Utils from '../../plugins/Utils'
import Reactnl2br from 'react-nl2br'

import Text from '../forms/Text'
import Textarea from '../forms/Textarea'
import Error from '../forms/Error'

class Contact extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			f_subject: '',
			f_message: '',
			f_email: '',
			inputs: {
				csrf_token: '',
				subject: '',
				email: '',
				message: ''
			},
			errors: {
				subject: [],
				email: [],
				message: [],
				system: []
			},
			confirmed: false,
			sended: false,
			forbidden: false,
			loading: false
		}
	}

	handlerState(name, value) {
		const param = {}
		param[name] = value
		this.setState(param)
	}

	async onConfirm() {
		this.setState({loading: true})
		await axios.post(Config.api.contact.confirm, {
			subject: this.state.f_subject,
			email: this.state.f_email,
			message: this.state.f_message,
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({
					inputs: res.data.inputs,
					errors: {
						subject: [],
						email: [],
						message: [],
						system: []
					},
					confirmed: true,
					sended: false
				})
			}
		}).catch((e) => {
			if(e.response.status === 400) {
				this.setState({
					errors: e.response.data.errors,
					confirmed: false,
					sended: false
				})
			}
		})

		this.setState({loading: false})
	}

	async onBack() {
		if(this.state.confirmed) {
			this.setState({loading: true})
			await axios.post(Config.api.contact.back, {
				credentials: 'same-origin'
			}).then((res) => {
				if(res.data.result) {
					this.setState({
						inputs: {
							token: '',
							subject: '',
							email: '',
							message: ''
						},
						confirmed: false,
						sended: false
					})
				}
			}).catch((e) => {
				if(e.response.status === 400) {
					this.setState({errors: e.response.data.errors})
				}
			})
			this.setState({loading: false})
		}
	}

	async onSend() {
		if(this.state.confirmed) {
			this.setState({loading: true})
			await axios.post(Config.api.contact.send, {
				csrf_token: this.state.inputs.csrf_token,
				subject: this.state.inputs.subject,
				email: this.state.inputs.email,
				message: this.state.inputs.message,
				credentials: 'same-origin'
			}).then((res) => {
				if(res.data.result) {
					this.setState({sended: true})
				}
			}).catch((e) => {
				if(e.response.status === 400) {
					this.setState({
						errors: e.response.data.errors,
						confirmed: false,
						sended: false,
						forbidden: res.data.forbidden
					})
				}
			})
			this.setState({loading: false})
		}
	}

	async onReset() {
		this.setState({loading: true})
		await Utils.wait(500)
		this.setState({
			f_subject: '',
			f_message: '',
			f_email: '',
			inputs: {
				token: '',
				subject: '',
				email: '',
				message: ''
			},
			errors: {
				subject: [],
				email: [],
				message: [],
				system: []
			},
			confirmed: false,
			sended: false,
			forbidden: false
		})
		this.setState({loading: false})
	}

	display() {
		if(!this.state.confirmed && !this.state.sended && !this.state.forbidden) {
			return (
				<div>
					<div className="card card-list">
						<div className="card-header">
							お問い合わせ内容を入力してください。
						</div>
						<div className="card-body">
							<Error error={this.state.errors.system}/>
							<div className="col-12 mb-2 p-2">
								<Text
								label="メールアドレス"
								formName="f_email"
								value={this.state.f_email}
								onChange={(name, value) => this.handlerState(name, value)}
								/>
								<Error error={this.state.errors.email}/>

								<Text
								label="件名"
								formName="f_subject"
								value={this.state.f_subject}
								onChange={(name, value) => this.handlerState(name, value)}
								/>
								<Error error={this.state.errors.subject}/>

								<Textarea
								label="お問い合わせ内容"
								formName="f_message"
								value={this.state.f_message}
								row={5}
								onChange={(name, value) => this.handlerState(name, value)}
								/>
								<Error error={this.state.errors.message}/>
							</div>
						</div>
						<div className="card-footer">
							<div className="col-12 d-flex">
								<button
								className="btn btn-primary ml-auto"
								onClick={(e) => this.onConfirm()}
								>
									確認
								</button>
							</div>
						</div>
					</div>
				</div>
			)
		} else if(this.state.confirmed && !this.state.sended && !this.state.forbidden) {
			return (
				<div>
					<div className="card card-list">
						<div className="card-header">
							お問い合わせ内容の確認
						</div>
						<div className="card-body">
							<Error error={this.state.errors.system}/>
							<div className="col-12 mb-2 p-2">
								件名：{this.state.inputs.subject}
							</div>
							<div className="col-12 mb-2 p-2">
								メールアドレス：{this.state.inputs.email}
							</div>
							<div className="col-12 mb-2 p-2">
								お問い合わせ内容=================
								<br/><br/>
								{Reactnl2br(this.state.inputs.message)}
								<br/><br/>
								==============================
							</div>
						</div>
						<div className="card-footer">
							<div className="col-12 d-flex">
								<button
								className="btn btn-default"
								onClick={(e) => this.onBack()}
								>
									入力し直す
								</button>
								<button
								className="btn btn-primary ml-auto"
								onClick={(e) => this.onSend()}
								>
									送信
								</button>
							</div>
						</div>
					</div>
				</div>
			)
		} else if(this.state.confirmed && this.state.sended && !this.state.forbidden) {
			return (
				<div>
					<div className="card card-list">
						<div className="card-header">
							お問い合わせありがとうございます。
						</div>
						<div className="card-body">
							メールの送信が完了いたしました。<br/>
							確認メールをお送りしてますので、ご確認をお願いいたします。<br/>
							また、確認メールは送信専用のメールアドレスとなっております。<br/>
							こちらよりご返信をいただいてもご対応致しかねますのでご了承のほどどうぞよろしくお願いいたします。
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div>
					<div className="card card-list">
						<div className="card-body">
							<Error error={this.state.errors.system}/>
						</div>
						<div className="card-footer">
							<div className="col-12 d-flex">
								<button
								className="btn btn-default"
								onClick={(e) => this.onReset()}
								>
									最初に戻る
									</button>
							</div>
						</div>
					</div>
				</div>
			)
		}
	}

	contents() {
		return (
			<div>
				<Loader
					is_loading={this.state.loading}
				/>
				<div className="card card-list">
					<div className="card-body">
						{this.display()}
					</div>
				</div>
			</div>
		)
	}

	render() {
		return (
			<Base title="Contact" content={this.contents()} />
		)
	}
}

export default Contact;