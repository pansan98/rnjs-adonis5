import React from 'react'

import Day from './Day'

class Week extends React.Component {
	constructor(props) {
		super(props)
	}

	viewweek() {
		return (
			<tbody role="presentation">
				{this.props.days.map((weeks, wk) => {
					return (
						<tr role="row" key={`week-${wk}`}>
							{weeks.map((date, dk) => {
								return (
									<Day
										key={`day-${dk}`}
										day={date.day}
										week={wk}
										isblank={date.blank}
										date={`${this.props.viewYear}-${this.props.viewMonth}-${date.day}`}
										viewYear={this.props.viewYear}
										viewMonth={this.props.viewMonth}
										clickDay={(year, month, day) => this.props.clickDay(year, month, day)}
									/>
								)
							})}
						</tr>
					)
				})}
			</tbody>
		)
	}

	render() {
		return (
			<table role="presentation" className="fc-scrollgrid-sync-table" style={{width: '100%', maxWidth: '2000px', minWidth: '805px', height: '566px'}}>
				{this.viewweek()}
			</table>
		)
	}
}

Week.defaultProps = {
	viewYear: '',
	viewMonth: ''
}

export default Week