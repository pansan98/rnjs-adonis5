import React from 'react'
import {io} from 'socket.io-client'
import axios from 'axios'
import Reactnl2br from 'react-nl2br'

import Utils from '../../plugins/Utils'
import Config from '../../config'

import Loader from '../common/Loader'
import Search from '../forms/Search'
import Styles from '../../../sass/plugins/Modal.module.scss'

class Chat extends React.Component {
	constructor(props) {
		super(props)
		this.socket = null

		this.state = {
			logs: [],
			message: '',
			loading: false,
			chatloading: false
		}

		this.refmessage = React.createRef()
	}

	componentDidUpdate(prevProps) {
		// 別のチャットルームを開いたとき
		if((this.props.active !== prevProps.active) && this.props.room_id && (this.props.room_id !== prevProps.room_id)) {
			if(this.props.active) {
				this.setState({chatloading: true})
				this.socket = io('ws://ws.adonis5.local:8360')
				this.socket.on('connect', () => {
					this.socket.on('chat:log:receive-'+this.props.room_id, (data) => {
						this.setState({logs: data.logs, chatloading: false}, () => {
							this.scrollMessageBottom()
						})
						// 未読のものを既読にする
						this.bulkChatread()
					})
					this.socket.emit('chat:log', {
						room_id: this.props.room_id
					})
					//this.fetch()
					this.socket.on('chat:send:receive-'+this.props.room_id, (data) => {
						if(parseInt(data.send_user_id) !== parseInt(this.props.user.user_id)) {
							this.chatread(data.trx_id)
							const logs = this.state.logs
							logs.push({
								send_user_id: data.send_user_id,
								message: data.message,
								trx_id: data.trx_id
							})
							this.setState({logs: logs}, () => {
								this.scrollMessageBottom()
							})
						}
					})

					this.socket.on('disconnect', (reason) => {
						if (reason === "io server disconnect") {
							this.disconnect()
						}
					})
				})
			} else {
				this.disconnect()
				this.setState({
					logs: [],
					message: '',
					loading: false
				})
			}
		}
	}

	componentWillUnmount() {
		// wsの切断
		this.disconnect()
	}

	disconnect() {
		if(this.socket) {
			this.socket.close()
			this.socket = null
		}
	}

	handlerState(name, value) {
		const param = {}
		param[name] = value
		this.setState(param)
	}

	scrollMessageBottom() {
		this.refmessage.current.scrollIntoView({behavor: 'smooth', block: 'end'})
	}

	async bulkChatread() {
		if(this.props.unreads.length) {
			Promise.all(this.props.unreads.map((view_id) => {
				return new Promise((resolve) => {
					axios.post(Config.api.chat.bulkread+this.props.user.user_id, {
						view_id: view_id,
						credentials: 'same-origin'
					}).then(resolve)
				})
			}))
		}
	}

	async chatread(trx_id) {
		axios.post(Config.api.chat.read+this.props.user.user_id, {
			trx_id: trx_id,
			credentials: 'same-origin'
		})
	}

	async fetch() {
		await axios.get(Config.api.chat.log+this.props.room_id, {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({logs: res.data.logs})
			}
		})
	}

	async onSend() {
		if(this.socket && this.state.message !== '') {
			const trx_id = Utils.random(50)
			this.socket.emit('chat:send', {
				trx_id: trx_id,
				room_id: this.props.room_id,
				send_user_id: this.props.user.user_id,
				message: this.state.message,
				reply_to: null
			})
			const logs = this.state.logs
			logs.push({
				trx_id: trx_id,
				send_user_id: this.props.user.user_id,
				message: this.state.message,
			})
			this.setState({
				message: '',
				logs: logs
			}, () => {
				this.scrollMessageBottom()
			})
		}
	}

	close() {
		this.disconnect()
		this.props.closefn()
	}

	display() {
		if(this.state.logs.length) {
			return (
				<div className="scrollable max-height-300">
					<Loader is_loading={this.state.chatloading}/>
					<div className="col-12">
						{this.state.logs.map((log) => {
							return (
								<div key={`${log.trx_id}-log`}>
									<div className="d-flex border-bottom py-2">
										<div className={(parseInt(log.send_user_id) === parseInt(this.props.user.user_id)) ? 'ml-auto' : 'mr-auto'}>
											{Reactnl2br(log.message)}
										</div>
									</div>
								</div>
							)
						})}
						<div ref={this.refmessage}/>
					</div>
				</div>
			)
		}
	}

	header() {
		return (
			<div className="modal-header">
				<h4 className="modal-title">チャット</h4>
				{(this.props.close)
				?
				<button
				className="btn btn-default"
				onClick={(e) => this.close()}
				>
					<i className="fas fa-times"></i>
				</button>
				: ''}
			</div>
		)
	}

	footer() {
		return (
			<div className="modal-footer justify-content-between">
				<Search
					value={this.state.message}
					formName="message"
					placeholder="メッセージを入力"
					wrapping_class="col-12"
					label="送信"
					onChange={(name, value) => this.handlerState(name, value)}
					onSearch={(e) => this.onSend()}
				/>
			</div>
		)
	}

	render() {
		if(this.props.active) {
			return (
				<div>
					<div className={Styles.mymodal}>
						<div className="modal-overlay"></div>
						<div className="modal">
							<Loader is_loading={this.state.loading}/>
							<div className={`modal-dialog`}>
								<div className="modal-content">
									{this.header()}
									<div className="modal-body overflow-hidden max-height-350">
										{this.display()}
									</div>
									{this.footer()}
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}
		return (<div></div>)
	}
}

Chat.defaultProps = {
	active: false,
	room_id: null,
	unreads: [],
	user: {},
	close: true,
	closefn: () => {}
}

export default Chat