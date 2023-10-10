import React from 'react'
import axios from 'axios'

import Config from '../../../config'

import Loader from '../../common/Loader'
import Base from '../Base'

class Topics extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			viewed: [],
			topics: []
		}
	}

	componentDidMount() {
		fetch(Config.api.cms.topics).then((res) => {
			return res.json()
		}).then((json) => {
			console.log(json)
		})
	}

	contents() {
		return (<div>システムからのお知らせ</div>)
	}

	render() {
		return (
			<Base title="Admin CMS" content={this.contents()} />
		)
	}
}

Topics.defaultProps = {
	user: null
}

export default Topics