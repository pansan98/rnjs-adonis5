import React from 'react'

class Day extends React.Component {
	constructor(props) {
		super(props)
	}

	viewEvents(events) {
		if(events.length) {
			return (
				<div className="fc-event-title-container">
					{events.map((event) => {
						return (
							<div key={`event-${event.calendar_id}`}>
								<h5>{event.summary}</h5>
								<button
								className="btn btn-danger"
								onClick={() => this.props.clickEventDestroy(event.calendar_id)}
								>
									<i className="fas fa-trash"></i>
								</button>
							</div>
						)
					})}
				</div>
			)
		} else {
			return (<div></div>)
		}
	}

	render() {
		if(this.props.isblank) {
			return (
				<td
				role="gridcell"
				className={`fc-daygrid-day fc-day fc-day-future fc-dayother`}
				>
				</td>
			)
		} else {
			return (
				<td
				role="gridcell"
				className={`fc-daygrid-day fc-day fc-day-future fc-dayother fc-day-${this.props.week}`}
				datadate={this.props.date}
				>
					<div className="fc-daygrid-dayframe fc-scrollgrid-sync-inner">
						<div
						className="fc-daygrid-day-top"
						onClick={(e) => this.props.clickDay(this.props.viewYear, this.props.viewMonth, this.props.day)}
						>
							<a className="fc-daygrid-day-number">{this.props.day}</a>
						</div>
						{this.viewEvents(this.props.events)}
					</div>
				</td>
			)
		}
	}
}

Day.defaultProps = {
	day: null,
	week: null,
	date: '',
	isblank: false,
	viewYear: null,
	viewMonth: null
}

export default Day