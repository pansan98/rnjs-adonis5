import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'
import Config from '../../../config'

import Loader from '../../common/Loader'
import Modal from '../../plugins/Modal'
import Base from '../Base'

import Search from '../../forms/Search'

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
					success: true,
					closefn: () => {},
					callbackfn: () => {}
				}
			}
		}

		this.state = {
			follows: [],
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
		const follows = await axios.get(Config.api.follow, {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.reuslt) {
				return res.data.follows
			}
			return []
		}).catch((e) => {
			console.log(e)
		})

		this.setState({
			follows: follows,
			fetched: true
		})
	}

	// ユーザーの検索
	search(e) {

	}

	// フォローする
	followAdd(idf) {

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
							key={sf.identify_code}
							>
							</div>
						)
					})}
				</div>
			)
		}
		return (<div></div>)
	}

	viewModal() {
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
								formName="search"
								placeholder="ユーザー名を入力"
								onChange={(name, value) => this.handlerState(name, value)}
								onSearch={(e) => this.search(e)}
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
							key={follow.identify_code}
							className="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column"
							>
								<div className="card bg-light d-flex flex-fill">
									<div className="card-header text-muted border-bottom-0">
										{follow.username}
									</div>
									<div className="card-body pt-0">
										<div className="row">
											<div className="col-7">
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
									</div>
									<div className="card-footer">
										<div className="d-flex">
											<button
											className="btn btn-default"
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
								<button className="btn btn-default">
									<i className="fas fa-user-plus"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="card card-list">
					<div className="card-body">
						{this.display()}
					</div>
				</div>

				<Modal
				title={this.state.add.title}
				active={this.state.add.active}
				classes={this.state.add.classess}
				closefn={this.state.add.closefn}
				success={this.state.add.success}
				callbackfn={this.state.add.callbackfn}
				>
					{this.modalFollowList()}
				</Modal>
			</div>
		)
	}

	render() {
		return (
			<Base title="Follows" content={this.contents()} />
		)
	}
}

export default Follows