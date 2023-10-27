import React from 'react'
import {Link} from 'react-router-dom'

import Config from '../../../config'

import Base from '../Base'

class Verify extends React.Component {
	constructor(props) {
		super(props)
	}

	contents() {
		return (
			<div>
				<p>
					{this.props.jsdata.sns}との連携に成功しました。<br/>
					<Link to={Config.links.home} className="btn btn-default">Homeに戻る</Link>
				</p>
			</div>
		)
	}

	render() {
		return (<Base title="SNS認証" loading={false} content={this.contents()} />)
	}
}

export default Verify