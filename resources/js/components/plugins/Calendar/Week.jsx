import React from 'react'

import Day from './Day'

class Week extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			days: []
		}
	}

	componentDidMount() {
		this.setdays()
	}

	setdays() {
		const date = new Date(this.props.viewYear, this.props.viewMonth, 1)
		let looper = 1
		let weeks = []
		const days = []
		const day = date.getDay()
		const lastdate = new Date(date.getFullYear(), date.getMonth()+1, 1)
		lastdate.setDate(0)
		const lastday = lastdate.getDate()

		for(let d = 1; d <= lastday; d++) {
			if(d === 1) {
				if(day > 0) {
					for(let blankday = (day - 1); blankday >= 0; blankday--) {
						weeks.push({
							blank: true,
							day: null
						})
						looper++
					}
				}
			}
			weeks.push({
				blank: false,
				day: d
			})
			//
			if((looper % 7)) {
				days.push(weeks)
				weeks = []
			}

			looper++
		}
		this.setState({days: days})
	}

	viewweek() {
		return (
			<tbody role="presentation">
				{this.state.days.map((weeks, wk) => {
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