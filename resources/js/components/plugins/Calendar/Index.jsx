import React from 'react'

import CalendarWeek from './Week'

class Calendar extends React.Component {
	constructor(props) {
		super(props)

		const now = new Date()
		this.state = {
			year: now.getFullYear(),
			month: now.getMonth() + 1,
			days: []
		}
	}

	componentDidMount() {
		this.setdays()
	}

	setdays() {
		const date = new Date(this.state.year, this.state.month - 1, 1)
		const day = date.getDay()
		const lastdate = new Date(this.state.year, this.state.month, 1)
		lastdate.setDate(0)
		const lastday = lastdate.getDate()

		const events = {}
		this.props.events.map((event) => {
			if(event.start.dateTime) {
				const date = new Date(event.start.dateTime)
				date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
				if(typeof events[date.getDate()] === 'undefined') {
					events[date.getDate()] = []
				}
				events[date.getDate()].push({
					summary: event.summary,
					description: event.description,
					calendar_id: event.id
				})
			}
		})
		let looper = 1
		let weeks = []
		const days = []
		for(let d = 1; d <= lastday; d++) {
			if(d === 1) {
				if(day > 0) {
					for(let blankday = (day - 1); blankday >= 0; blankday--) {
						weeks.push({
							blank: true,
							day: null,
							events: []
						})
						looper++
					}
				}
			}
			weeks.push({
				blank: false,
				day: d,
				events: (typeof events[d] !== 'undefined') ? events[d] : []
			})
			//
			if((looper % 7) === 0) {
				days.push(weeks)
				weeks = []
			}
			if(d === lastday) {
				if((looper % 7) !== 0) {
					days.push(weeks)
				}
			}

			looper++
		}
		this.setState({days: days})
	}

	clickPrevMonth() {
		const date = new Date(this.state.year, this.state.month, 1)
		const month = date.getMonth()
		let m
		if(month === 1) {
			date.setFullYear(date.getFullYear() - 1)
			m = 12
		} else if(month === 0) {
			date.setFullYear(date.getFullYear() - 1)
			m = 11
		} else {
			m = month - 1
		}
		this.setState({
			year: date.getFullYear(),
			month: m
		}, () => {
			this.props.changeMonthCallback(this.state.year, this.state.month)
			this.setdays()
		})
	}

	clickNextMonth() {
		const date = new Date(this.state.year, this.state.month, 1)
		const month = date.getMonth()
		let m
		if(month >= 12) {
			date.setFullYear(date.getFullYear() + 1)
			m = 1
		} else {
			m = month + 1
		}
		this.setState({
			year: date.getFullYear(),
			month: m
		}, () => {
			this.props.changeMonthCallback(this.state.year, this.state.month)
			this.setdays()
		})
	}

	render() {
		return (
			<div>
				<div className="col-md-12">
					<div className="card card-primary">
						<div className="card-body p-0">
							<div
							id="google-calendar"
							className="fc fc-media-screen fc-direction-ltr fc-theme-bootstrap"
							>
								<div className="fc-header-toolbar fc-toolbar fc-toolbar-ltr">
									<div className="fc-toolbar-chunk">
										<div className="btn-group">
											<button
											type="button"
											className="fc-prev-button btn btn-primary"
											title="Previus month"
											aria-pressed="false"
											onClick={() => this.clickPrevMonth()}
											>
												<span className="fa fa-chevron-left"></span>
											</button>
											<button
											type="button"
											className="fc-next-button btn btn-primary"
											title="Next month"
											aria-pressed="false"
											onClick={() => this.clickNextMonth()}
											>
												<span className="fa fa-chevron-right"></span>
											</button>
										</div>
									</div>
									<div className="fc-toolbar-chunk">
										<h2 id="fc-dom-month" className="fc-toolbar-title">{this.state.year}年{this.state.month}月</h2>
									</div>
									<div className="fc-toolbar-chunk">
										<div className="btn-group">

										</div>
									</div>
								</div>
								<div className="fc-view-harness fc-view-harness-active">
									<div className="fc-daygrid fc-dayGridMonth-view fc-view">
										<table role="grid" className="fc-scrollgrid table-bordered fc-scrollgrid-liquid" style={{width: '100%', maxWidth: '2000px', minWidth: '805px'}}>
											<thead rol="rowgroup">
												<tr role="presentation" className="fc-scrollgrid-section fc-scrollgrid-section-header">
													<th role="presentation">
														<div className="fc-scroller-harness">
															<div className="fc-scroller" style={{overflow: 'hidden'}}>
																<table role="presentation" className="fc-col-header" style={{width: '100%', maxWidth: '2000px', minWidth: '805px'}}>
																	<thead role="presentation">
																		<tr role="row">
																			<th role="columnheader" className="fc-col-header-cell fc-day fc-day-sun">
																				<div className="fc-scrollgrid-sync-inner">
																					<a aria-label="Sunday" className="fc-col-header-cell-cushion">Sun</a>
																				</div>
																			</th>
																			<th role="columnheader" className="fc-col-header-cell fc-day fc-day-mon">
																				<div className="fc-scrollgrid-sync-inner">
																					<a aria-label="Monday" className="fc-col-header-cell-cushion">Mon</a>
																				</div>
																			</th>
																			<th role="columnheader" className="fc-col-header-cell fc-day fc-day-tue">
																				<div className="fc-scrollgrid-sync-inner">
																					<a aria-label="Tuesday" className="fc-col-header-cell-cushion">Tue</a>
																				</div>
																			</th>
																			<th role="columnheader" className="fc-col-header-cell fc-day fc-day-wed">
																				<div className="fc-scrollgrid-sync-inner">
																					<a aria-label="Wednsday" className="fc-col-header-cell-cushion">Wed</a>
																				</div>
																			</th>
																			<th role="columnheader" className="fc-col-header-cell fc-day fc-day-thu">
																				<div className="fc-scrollgrid-sync-inner">
																					<a aria-label="Thuesday" className="fc-col-header-cell-cushion">Thu</a>
																				</div>
																			</th>
																			<th role="columnheader" className="fc-col-header-cell fc-day fc-day-fri">
																				<div className="fc-scrollgrid-sync-inner">
																					<a aria-label="Friday" className="fc-col-header-cell-cushion">Fri</a>
																				</div>
																			</th>
																			<th role="columnheader" className="fc-col-header-cell fc-day fc-day-Sat">
																				<div className="fc-scrollgrid-sync-inner">
																					<a aria-label="Satuday" className="fc-col-header-cell-cushion">Sat</a>
																				</div>
																			</th>
																		</tr>
																	</thead>
																</table>
															</div>
														</div>
													</th>
												</tr>
											</thead>
											<tbody role="rowgroup">
												<tr role="presentation" className="fc-scrollgrid-section fc-scrollgrid-section-body fc-scrollgrid-section-liquid">
													<td role="presentation">
														<div className="fc-scroller-harness fc-scroller-harness-liquid">
															<div className="fc-scroller fc-scroller-liquid-absolute" style={{overflow: 'hidden'}}>
																<div className="fc-daygrid-body fc-daygrid-body-unbalanced" style={{width: '100%', maxWidth: '2000px', minWidth: '805px'}}>
																	<CalendarWeek
																	clickDay={(year, month, day) => this.props.clickDay(year, month, day)}
																	clickEventDestroy={(calendar_id) => this.props.clickEventDestroy(calendar_id)}
																	viewYear={this.state.year}
																	viewMonth={this.state.month}
																	days={this.state.days}
																	/>
																</div>
															</div>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

Calendar.defaultProps = {
	events: [],
	clickDay: (year, month, day) => {},
	changeMonthCallback: (year, month) => {}
}

export default Calendar