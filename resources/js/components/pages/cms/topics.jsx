import React from 'react'

import Config from '../../../config'
import Utils from '../../../plugins/Utils'

import Loader from '../../common/Loader'
import Base from '../Base'

class Topics extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			viewed: [],
			topics: []
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

	viewed(morphs_id) {
		Utils.api('get', Config.api.morphs.admin.topics.viewed, {
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
											<td>{v.attributes.title}</td>
											<td className="project-actions text-center">
												<button className="btn btn-default btn-sm ml-1">
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
			</div>
		)
	}

	render() {
		return (
			<Base title="システムからのお知らせ" content={this.contents()} loading={this.state.loading} />
		)
	}
}

Topics.defaultProps = {
	user: null
}

export default Topics