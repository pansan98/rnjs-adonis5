import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'
import Config from '../../../config'

import Loader from '../../common/Loader'
import Modal from '../../plugins/Modal'
import Base from '../Base'

import Search from '../../forms/Search'
import Chat from '../../plugins/Chat'

class Follows extends React.Component {
	constructor(props) {
		super(props)

		// デフォルトオプション
		this.config = {
			modals: {
				add: {
					active: false,
					title: 'フォローするユーザーを検索',
					classes: ['modal-lg'],
					success: false,
					closefn: () => {},
					callbackfn: () => {}
				}
			},
			chat: {
				active: false,
				room_id: null,
				closefn: () => {}
			}
		}

		this.state = {
			follows: [],
			unfollows: [],
			fetched: false,
			loading: false,
			usersearch: '',
			searchfollowlist: [],
			follow_add: {
				active: this.config.modals.add.active,
				title: this.config.modals.add.title,
				classes: this.config.modals.add.classes,
				success: this.config.modals.add.success,
				closefn: () => this.config.modals.add.closefn,
				callbackfn: () => this.config.modals.add.callbackfn
			},
			chat: {
				active: this.config.chat.active,
				room_id: this.config.chat.room_id,
				closefn: () => this.config.chat.closefn
			}
		}
	}

	componentDidMount() {
		this.fetch()
	}

	handlerState(name, value) {
		const param = {}
		param[name] = value
		this.setState(param)
	}

	async fetch() {
		const [follows, unfollows] = await axios.get(Config.api.follow.list, {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				return [res.data.follows, res.data.unfollows]
			}
			return [[], []]
		})

		this.setState({
			follows: follows,
			unfollows: unfollows,
			fetched: true
		})
	}

	// ユーザーの検索
	async search(word) {
		this.setState({loading: true})
		await axios.get(Config.api.follow.search, {
			params: {
				word: word
			},
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({searchfollowlist: res.data.list})
			}
		})
		this.setState({loading: false})
	}

	// フォローする
	async followAdd(idf) {
		this.setState({loading: true})
		await axios.post(Config.api.follow.add+'/'+idf, {
			credentials: 'same-origin'
		})
		this.setState({loading: false})
		await this.fetch()
		await this.search(this.state.usersearch)
	}

	// フォローを外す
	async followRemove(idf) {
		this.setState({loading: true})
		await axios.post(Config.api.follow.remove+'/'+idf, {
			credentials: 'same-origin'
		})
		this.setState({loading: false})
		await this.fetch()
	}

	// 検索結果
	followList() {
		if(this.state.searchfollowlist.length) {
			return (
				<div>
					{this.state.searchfollowlist.map((sf) => {
						// 検索結果ユーザーリスト
						return (
							<div
							key={`${sf.identify_code}_search`}
							>
								<div className="col-12 mb-2 p-2 border border-primary d-flex">
									<div className="col-8">
										<img
										src={(sf.thumbnail_path) ? sf.thumbnail_path : Config.noimage}
										className="profile-user-img img-fluid img-circle"
										style={{
											height: '60px', width: '60px', objectFit: 'cover'
										}}
										/>
										<p className="d-inline-flex ml-2">{sf.username}</p>
									</div>
									<div className="col-4 ml-auto d-inline-flex justify-content-end align-items-center">
										<button
										className="btn btn-default"
										onClick={(e) => this.followAdd(sf.identify_code)}
										>
											<i className="fas fa-user-plus"></i>
										</button>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)
		}
		return (<div></div>)
	}

	async viewChat(user_id) {
		this.setState({loading: true})
		await axios.get(Config.api.chat.start+user_id, {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({
					chat: {
						active: true,
						room_id: res.data.room_id,
						user: this.props.user,
						closefn: () => {this.closeChat()}
					}
				})
			}
		})
		this.setState({loading: false})
	}

	closeChat() {
		this.setState({
			chat: this.config.chat
		})
	}

	viewModal(e) {
		this.setState({
			follow_add: Object.assign(this.config.modals.add, {
				active: true,
				closefn: () => this.closeModal()
			})
		})
	}

	closeModal() {
		this.setState({
			usersearch: '',
			searchfollowlist: [],
			follow_add: Object.assign(this.config.modals.add, {active: false})
		})
	}

	modalFollowList() {
		return (
			<div>
				<div className="card">
					<div className="card-body">
						<div className="d-flex">
							<Search
								value={this.state.usersearch}
								formName="usersearch"
								placeholder="ユーザー名を入力"
								wrapping_class="col-12"
								onChange={(name, value) => this.handlerState(name, value)}
								onSearch={(e) => this.search(this.state.usersearch)}
							/>
						</div>
					</div>
				</div>
				<div className="card card-list">
					<div className="card-body">
						{this.followList()}
					</div>
				</div>
			</div>
		)
	}

	display() {
		if(this.state.fetched && !this.state.follows.length) {
			return (<div>誰もフォローしていません。</div>)
		} else if(!this.state.fetched) {
			return (<div>取得中...</div>)
		} else {
			return (
				<div>
					{this.state.follows.map((follow) => {
						return (
							<div
							key={`${follow.identify_code}_list`}
							className="col-12 col-sm-6 col-md-2 d-flex align-items-stretch flex-column"
							>
								<div className="card bg-light d-flex flex-fill">
									<div className="card-header text-muted border-bottom-0">
										{follow.username}
									</div>
									<div className="card-body pt-0">
										<div>
											<div className="text-center">
												<img
													src={(follow.thumbnail_path) ? follow.thumbnail_path : Config.noimage}
													className="profile-user-img img-fluid img-circle"
													style={{
														height: '100px', objectFit: 'cover'
													}}
												/>
											</div>
										</div>
									</div>
									<div className="card-footer">
										<div className="d-flex">
											<button
											className="btn btn-primary"
											onClick={(e) => this.viewChat(follow.user_id)}
											>
												<i className="fas fa-comment-dots"></i>
											</button>
											<button
											className="btn btn-default ml-auto"
											onClick={(e) => this.followRemove(follow.identify_code)}
											>
												<i className="fas fa-user-minus"></i>
											</button>
										</div>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)
		}
	}

	unfollowdisplay() {
		if(this.state.fetched && !this.state.unfollows.length) {
			return (<div></div>)
		} else if(!this.state.fetched) {
			return (<div></div>)
		} else {
			return (
				<div className="card card-list">
					<div className="card-header">
						あなたをフォローしているユーザーです。
					</div>
					<div className="card-body">
						{this.state.unfollows.map((unfollow) => {
							return (
								<div
								key={`${unfollow.identify_code}_unfowllow`}
								>
									<div className="col-12 mb-2 p-2 border border-primary d-flex">
										<div className="col-8">
											<img
											src={(unfollow.thumbnail_path) ? unfollow.thumbnail_path : Config.noimage}
											className="profile-user-img img-fluid img-circle"
											style={{
												height: '60px', width: '60px', objectFit: 'cover'
											}}
											/>
											<p className="d-inline-flex ml-2">{unfollow.username}</p>
										</div>
										<div className="col-4 ml-auto d-inline-flex justify-content-end align-items-center">
											<button
											className="btn btn-default"
											onClick={(e) => this.followAdd(unfollow.identify_code)}
											>
												<i className="fas fa-user-plus"></i>
											</button>
										</div>
									</div>
								</div>
							)
						})}
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
				<div className="card">
					<div className="card-body">
						<div className="d-flex">
							<div className="ml-auto">
								<button
								className="btn btn-default"
								onClick={(e) => this.viewModal(e)}
								>
									<i className="fas fa-search"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
				{this.unfollowdisplay()}
				<div className="card card-list">
					<div className="card-body">
						{this.display()}
					</div>
				</div>

				<Modal
				title={this.state.follow_add.title}
				active={this.state.follow_add.active}
				classes={this.state.follow_add.classes}
				closefn={this.state.follow_add.closefn}
				success={this.state.follow_add.success}
				callbackfn={this.state.follow_add.callbackfn}
				>
					{this.modalFollowList()}
				</Modal>

				<Chat
				active={this.state.chat.active}
				room_id={this.state.chat.room_id}
				user={this.state.chat.user}
				closefn={this.state.chat.closefn}
				/>
			</div>
		)
	}

	render() {
		return (
			<Base title="Follows" content={this.contents()} />
		)
	}
}

Follows.defaultProps = {
	user: {}
}

export default Follows