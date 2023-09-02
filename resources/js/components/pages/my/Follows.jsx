import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'
import Config from '../../../config'

import Loader from '../../common/Loader'
import Base from '../Base'

class Follows extends React.Component {
    contents() {
        return (<div></div>)
    }

    render() {
		return (
			<Base title="Follows" content={this.contents()} />
		)
	}
}

export default Follows