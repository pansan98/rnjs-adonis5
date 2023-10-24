import React from 'react'

class Day extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<td
			role="gridcell"
			className={`fc-daygrid-day fc-day fc-day-future fc-dayother fc-day-${this.props.week}`}
			datadate={this.props.date}
			onClick={(e) => this.props.clickDay('2023', '10', this.props.day)}
			>
				<div className="fc-daygrid-dayframe fc-scrollgrid-sync-inner">
					<div className="fc-daygrid-day-top">
						<a className="fc-daygrid-day-number">{this.props.day}</a>
					</div>
				</div>
			</td>
		)
	}
}

export default Day