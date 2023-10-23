import React from 'react'

import CalendarWeek from './Week'

class Calendar extends React.Component {
	constructor(props) {
		super(props)
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
											>
												<span className="fa fa-chevron-left"></span>
											</button>
											<button
											type="button"
											className="fc-next-button btn btn-primary"
											title="Next month"
											aria-pressed="false"
											>
												<span className="fa fa-chevron-right"></span>
											</button>
										</div>
									</div>
									<div className="fc-toolbar-chunk">
										<h2 id="fc-dom-month" className="fc-toolbar-title">2023 10</h2>
									</div>
									<div className="fc-toolbar-chunk">
										<div className="btn-group">

										</div>
									</div>
								</div>
								<div className="fc-view-harness fc-view-harness-active">
									<div className="fc-daygrid fc-dayGridMonth-view fc-view">
										<table role="grid" className="fc-scrollgrid table-bordered fc-scrollgrid-liquid">
											<thead rol="rowgroup">
												<tr role="presentation" className="fc-scrollgrid-section fc-scrollgrid-section-header">
													<th role="presentation">
														<div className="fc-scroller-harness">
															<div className="fc-scroller" style={{overflow: 'hidden'}}>
																<table role="presentation" className="fc-col-header" style={{width: '805px'}}>
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
																<div className="fc-daygrid-body fc-daygrid-body-unbalanced" style={{width: '805px'}}>
																	<CalendarWeek/>
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

export default Calendar