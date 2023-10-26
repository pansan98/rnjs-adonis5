import React from 'react'
import {Link} from 'react-router-dom'

import Config from '../../../config'
import Utils from '../../../plugins/Utils'

import Base from '../Base'
import Calendar from '../../plugins/Calendar/Index'
import Modal from '../../plugins/Modal'

import Text from '../../forms/Text'
import Textarea from '../../forms/Textarea'
import Error from '../../forms/Error'

class Schedule extends React.Component {
	constructor(props) {
		super(props)

		this.config = {
			modals: {
				create: {
					active: false,
					title: 'イベントを追加',
					classes: ['modal-lg'],
					success: true,
					success_text: '登録',
					closefn: () => {},
					callbackfn: () => {}
				},
				snsauth: {
					active: false,
					title: 'Googleアカウントと連携',
					classes: ['modal-lg'],
					success: true,
					success_text: '連携',
					closefn: () => {},
					callbackfn: () => {}
				}
			}
		}

		this.state = {
			loading: false,
			title: '',
			description: '',
			oauthredirect: '',
			connected: false,
			errors: {
				system: [],
				title: []
			},
			create: {
				active: this.config.modals.create.active,
				title: this.config.modals.create.title,
				classes: this.config.modals.create.classes,
				success: this.config.modals.create.success,
				closefn: () => this.config.modals.create.closefn,
				callbackfn: () => this.config.modals.create.callbackfn
			},
			snsauth: {
				active: this.config.modals.snsauth.active,
				title: this.config.modals.snsauth.title,
				classes: this.config.modals.snsauth.classes,
				success: this.config.modals.snsauth.success,
				success_text: this.config.modals.snsauth.success_text,
				closefn: () => this.config.modals.snsauth.closefn,
				callbackfn: () => this.config.modals.snsauth.callbackfn
			}
		}
	}

	componentDidMount() {
		this.events()
	}

	async events() {
		this.setState({loading: true})
		await Utils.api('GET', Config.api.google.event.events).then((json) => {
			if(!json.auth) {
				this.setState({oauthredirect: json.data.redirect_url})
				this.activeSnsOAuth()
			} else {
				this.setState({connected: true})
			}
		})
		this.setState({loading: false})
	}

	activeSnsOAuth() {
		this.setState({
			snsauth: Object.assign(this.config.modals.snsauth, {
				active: true,
				closefn: () => {this.closeSnsOAuth()},
				callbackfn: () => {this.connectSnsOAuth()}
			})
		})
	}

	connectSnsOAuth() {
		window.location = this.state.oauthredirect
	}

	closeSnsOAuth() {
		this.setState({
			snsauth: Object.assign(this.config.modals.snsauth, {
				active: false
			})
		})
	}

	viewSnsOAuth() {
		return (
			<div>
				<p>Googleアカウントと連携できていません。<br/>登録済みのイベントを取得、登録を行うには連携が必要です。</p>
			</div>
		)
	}

	handlerState(name, value) {
		const param = {}
		param[name] = value
		this.setState(param)
	}

	clickDay(year, month, day) {
		const title = year+'年'+month+'月'+day+'日のイベントを作成'
		this.setState({
			create: Object.assign(this.config.modals.create, {
				title: title,
				active: true,
				closefn: () => {this.closeCreate()},
				callbackfn: () => {this.eventCreate()}
			})
		})
	}

	async eventCreate(year, month, day) {
		this.setState({loading: true})
		await Utils.apiHandler('post', Config.api.google.event.create, {
			date: {
				year: year,
				month: month,
				day: day
			},
			title: this.state.title,
			description: this.state.description
		}).then((json) => {
			if(json.result) {
				this.closeCreate()
			}
		}).catch((e) => {
			if(e.response.status === 400) {
				this.setState({errors: e.response.data.errors})
			}
		})
		this.setState({loading: false})
	}

	closeCreate() {
		this.setState({
			title: '',
			description: '',
			create: Object.assign(this.config.modals.create, {
				active: false,
				title: ''
			})
		})
	}

	viewCreate() {
		return (
			<div>
				<div className="card">
					<div className="card-body">
						<Error error={this.state.errors.system}/>
						<Text
							formName="title"
							type="text"
							label="イベント名"
							value={this.state.title}
							onChange={(name, value) => this.handlerState(name, value)}
						/>
						<Error error={this.state.errors.title}/>
						<Textarea
							formName="description"
							label="イベントの詳細"
							value={this.state.description}
							onChange={(name, value) => this.handlerState(name, value)}
						/>
					</div>
				</div>
			</div>
		)
	}

	contents() {
		if(this.connected) {
			return (
				<div>
					<Calendar
						clickDay={(year, month, day) => this.clickDay(year, month, day)}
					/>
					<Modal
						title={this.state.create.title}
						active={this.state.create.active}
						classes={this.state.create.classes}
						success={this.state.create.success}
						closefn={this.state.create.closefn}
						callbackfn={this.state.create.callbackfn}
					>
						{this.viewCreate()}
					</Modal>
				</div>
			)
		} else {
			return (
				<div>
					<div>
						<div>Googleカレンダーと連携できていません。</div>
						<button
							className="btn btn-primary ml-auto"
							onClick={(e) => this.connectSnsOAuth()}
							>
								連携
						</button>	
					</div>
					<Modal
						title={this.state.snsauth.title}
						active={this.state.snsauth.active}
						classes={this.state.snsauth.classes}
						success={this.state.snsauth.success}
						success_text={this.state.snsauth.success_text}
						closefn={this.state.snsauth.closefn}
						callbackfn={this.state.snsauth.callbackfn}
					>
						{this.viewSnsOAuth()}
					</Modal>
				</div>
			)
		}
	}

	render() {
		return (<Base title="今後の予定" content={this.contents()} loading={this.state.loading}/>)
	}
}

Schedule.defaultProps = {
	user: null
}

export default Schedule