import React from 'react'

import Day from './Day'

class Week extends React.Component {
	constructor(props) {
		super(props)

		const days = []
		let week = []
		for(let i = 1; i <= 31; i++) {
			week.push(i)
			if((i % 7) === 0) {
				days.push(week)
				week = []
			}
		}
		if(week.length) {
			days.push(week)
		}

		this.state = {
			days: days
		}
	}

	render() {
		return (
			<table role="presentation" className="fc-scrollgrid-sync-table" style={{width: '100%', maxWidth: '2000px', minWidth: '805px', height: '566px'}}>
				<tbody role="presentation">
					{this.state.days.map((weeks, wk) => {
						return (
							<tr role="row" key={`week-${wk}`}>
								{weeks.map((day, dk) => {
									return (
										<Day
											key={`day-${dk}`}
											day={day}
											week={wk}
											date={`2023-10-${day}`}
											clickDay={(year, month, day) => this.props.clickDay(year, month, day)}
										/>
									)
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
		)
	}
}

export default Week