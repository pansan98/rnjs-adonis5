import React from 'react'
import {Link} from 'react-router-dom'

import Base from '../Base'
import Calendar from '../../plugins/Calendar/Index'

class Schedule extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: false
		}
	}

	contents() {
		return (
			<div>
				<Calendar/>
			</div>
		)
	}

	render() {
		return (<Base title="今後の予定" content={this.contents()} loading={this.state.loading}/>)
	}
}

Schedule.defaultProps = {
	user: null
}

export default Schedule