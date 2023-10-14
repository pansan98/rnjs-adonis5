import React from 'react'
import ReactMarkdown from 'react-markdown'

import Config from '../../../config'
import Utils from '../../../plugins/Utils'

import Loader from '../../common/Loader'
import Base from '../Base'
import Modal from '../../plugins/Modal'

class Topics extends React.Component {
	constructor(props) {
		super(props)

		this.config = {
			modals: {
				topic: {
					active: false,
					title: '',
					classes: ['modal-lg'],
					success: false,
					closefn: () => {},
					callbackfn: () => {}
				}
			}
		}

		this.state = {
			loading: true,
			viewed: [],
			topics: [],
			topic: null,
			modaltopic: {
				active: this.config.modals.topic.active,
				title: this.config.modals.topic.title,
				classes: this.config.modals.topic.classes,
				success: this.config.modals.topic.success,
				closefn: this.config.modals.topic.closefn,
				callbackfn: this.config.modals.topic.callbackfn
			}
		}
	}

	componentDidMount() {
		Utils.api('get', Config.api.morphs.admin.topics.views, {
			morphs_type: 'topics'
		}).then((json) => {
			this.setState({viewed: json.views})
		}).then(() => {
			Utils.api('get', Config.api.external.cms.topics, {
				sort: 'public_date:desc'
			}, false).then((json) => {
				this.setState({
					topics: json.data,
					loading: false
				})
			})
		})
	}

	getTopic(topic_id) {
		this.setState({loading: true})
		Utils.api('get', Config.api.external.cms.topics+'/'+topic_id).then((json) => {
			if(json.data) {
				Utils.api('post', Config.api.morphs.admin.topics.viewed, {
					morphs_id: json.data.id,
					morphs_type: 'topics'
				})
				if(!this.state.viewed.includes(topic_id)) {
					this.state.viewed.push(topic_id)
				}
			}
			this.setState({
				loading: false,
				topic: (json.data) ? json.data : null,
				modaltopic: Object.assign(this.config.modals.topic, {
					active: true,
					title: (json.data.attributes.title) ? json.data.attributes.title : '',
					closefn: () => this.closeTopic()
				})
			})
		}).catch((e) => {
			console.log(e)
			this.setState({loading: false})
		})
	}

	closeTopic() {
		this.setState({
			topic: null,
			modaltopic: Object.assign(this.config.modals.topic, {
				active: false,
				title: ''
			})
		})
	}

	viewTopic() {
		if(this.state.topic) {
			return (
				<div>
					<div className="card card-list">
						<div className="card-body">
							<h3 className="pb-10">日時：{this.state.topic.attributes.public_date}</h3>
							<hr/>
							<div>
								<ReactMarkdown>{this.state.topic.attributes.contents}</ReactMarkdown>
							</div>
						</div>
					</div>
				</div>
			)
		}
		return (<div>見つかりません。</div>)
	}

	viewed(morphs_id) {
		Utils.api('post', Config.api.morphs.admin.topics.viewed, {
			morphs_id: morphs_id,
			morphs_type: 'topics'
		}).then((json) => {
			const viewed = this.state.viewed
			viewed.push(morphs_id)
			this.setState({viewed: viewed})
		})
	}

	contents() {
		return (
			<div>
				<div className="card">
					<div className="card-body p-0">
						<table className="table table-striped projects">
							<tbody>
								{this.state.topics.map((v, k) => {
									return (
										<tr key={k}>
											<td>{v.attributes.public_date}</td>
											<td>
												{(!this.state.viewed.includes(v.id))?
												<span
												style={{
													backgroundColor: 'red',
													marginRight: '5px',
													padding: '5px 10px'
												}}
												>
													<i
													className="fas fa-exclamation"
													style={{color: 'white'}}
													>
													</i>
												</span>
												:''}
												{v.attributes.title}
											</td>
											<td className="project-actions text-center">
												<button
												className="btn btn-default btn-sm ml-1"
												onClick={(e) => this.getTopic(v.id)}
												>
													表示
												</button>
												{(!this.state.viewed.includes(v.id))?
												<button className="btn btn-warning btn-sm ml-1" onClick={(e) => this.viewed(v.id)}>
													既読
												</button>
												:''}
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>

				<Modal
				title={this.state.modaltopic.title}
				active={this.state.modaltopic.active}
				classes={this.state.modaltopic.classes}
				closefn={this.state.modaltopic.closefn}
				callbackfn={this.state.modaltopic.callbackfn}
				success={this.state.modaltopic.success}
				>
					{this.viewTopic()}
				</Modal>
			</div>
		)
	}

	render() {
		return (
			<Base
			title="システムからのお知らせ"
			content={this.contents()}
			loading={this.state.loading}
			pageloading={false}
			/>
		)
	}
}

Topics.defaultProps = {
	user: null
}

export default Topics