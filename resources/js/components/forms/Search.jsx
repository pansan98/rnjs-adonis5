import React from 'react'

class Search extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="col-10">
				<div className="input-group">
					<input
						className="form-control"
						type="text"
						placeholder={this.props.placeholder}
						value={this.props.value}
						onChange={(e) => this.props.onChange(this.props.formName, e.currentTarget.value)}
					/>
					<div className="input-group-append">
						<button className="btn btn-default" onClick={(e) => this.props.onSearch(e)}>
							{this.props.label}
						</button>
					</div>
				</div>
			</div>
		)
	}
}

Search.defaultProps = {
	value: '',
	formName: 'search',
	placeholder: '商品名を入力してください。',
	label: '検索'
}

export default Search