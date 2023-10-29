import React from 'react'

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
			events: [],
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
		const now = new Date()
		const year = now.getFullYear()
		const month = now.getMonth() + 1
		const [expire_min, expire_max] = this.getRange(year, month)

		this.events(expire_min, expire_max)
	}

	// Google カレンダーからイベントを取得
	async events(expire_min, expire_max) {
		const queries = new URLSearchParams({
			expire_min: expire_min,
			expire_max: expire_max
		})
		this.setState({loading: true})
		await Utils.api('GET', Config.api.google.event.events+'?'+queries.toString()).then((json) => {
			if(!json.auth) {
				this.setState({oauthredirect: json.data.redirect_url})
				this.activeSnsOAuth()
			} else {
				if(!this.state.connected) {
					this.setState({connected: true})
				}
				console.log(json.events)
				this.setState({events: json.events})
			}
		})
		this.setState({loading: false})
	}

	// 初日と月末を取得
	getRange(year, month) {
		const expire_min = new Date(year, month - 1, 1)
		expire_min.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
		
		const expire_max = new Date(year, month, 1)
		expire_max.setDate(0)
		expire_max.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })

		return [expire_min.getTime(), expire_max.getTime()]
	}

	// 月が変わったとき
	async changeMonth(year, month) {
		const [expire_min, expire_max] = this.getRange(year, month)
		await this.events(expire_min, expire_max)
	}

	// OAuthのモーダルを表示
	activeSnsOAuth() {
		this.setState({
			snsauth: Object.assign(this.config.modals.snsauth, {
				active: true,
				closefn: () => {this.closeSnsOAuth()},
				callbackfn: () => {this.connectSnsOAuth()}
			})
		})
	}

	// Googleの連携
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
		if(this.state.connected) {
			return (
				<div>
					<Calendar
						clickDay={(year, month, day) => this.clickDay(year, month, day)}
						changeMonthCallback={(year, month) => this.changeMonth(year, month)}
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
		return (<Base title="今後の予定" content={this.contents()} pageloading={false} loading={this.state.loading}/>)
	}
}

Schedule.defaultProps = {
	user: null
}

export default Schedule