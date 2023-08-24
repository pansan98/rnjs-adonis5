import React from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import Config from '../../config'

class User extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			user: {}
		}
		this.axiosCancelToken;
	}

	componentDidMount() {
		if(!this.props.user) {
			this.fetch()
		} else {
			this.setState({user: this.props.user})
		}
	}

	componentWillUnmount() {
		this.axiosCancelToken.cancel()
	}

	async fetch() {
		this.axiosCancelToken = axios.CancelToken.source()
		await axios.get(Config.api.auth.user, {
			credentials: 'same-origin',
			cancelToken: this.axiosCancelToken.token
		}).then((res) => {
			if(res.data.result) {
				this.setState({user: res.data.user})
			}
		}).catch((e) => {
			console.log(e)
		})
	}

	contents() {
		if(this.props.type === 'side-menu') {
			return (
				<div className="user-panel mt-3 pb-3 mb-3 d-flex">
					<div className="image">
						<img src={(this.state.user.thumbnail_path) ? this.state.user.thumbnail_path : '/assets/img/no-image.jpg'} className="img-circle elevation-2"/>
					</div>
					<div className="info">
						<Link to={Config.links.profile} className="d-block">{this.state.user.username}</Link>
					</div>
				</div>
			)
		} else {
			return (
				<div className="user-profile">
					<p className="username text-center">ようこそ、{this.state.user.username}さん</p>
				</div>
			)
		}
	}

	render() {
		return (
			<div>{this.contents()}</div>
		)
	}
}

User.defaultProps = {
	type: 'default',
	user: null
}

export default User