import React from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import axios from 'axios'
import Config from '../config'

// Pages
import Home from './pages/Home'
import Contact from './pages/Contact'
import StopWatch from './pages/practice/StopWatch'
import MyProfile from './pages/my/Profile'
import MyFollows from './pages/my/Follows'
import Shop from './pages/Shop'
import ShopCreate from './pages/shop/Edit'
import ShopEdit from './pages/shop/ParamsEdit'
import ShopViews from './pages/shop/ParamsViews'
import Ec from './pages/Ec'
import EcDetail from './pages/ec/ParamsDetail'
import EcCart from './pages/ec/Cart'
import EcFavorites from './pages/ec/Favorites'
import EcHistory from './pages/ec/History'
import EcReview from './pages/ec/ParamsReview'

import Event from './pages/Event'
import EventEdit from './pages/event/Edit'
import EventCategory from './pages/event/Category'

// Auth
import Login from './auth/Login'
import Register from './auth/Register'
import Authorize from './auth/ParamsAuthorize'
import Forgot from './auth/Forgot'
import Password from './auth/ParamsPassword'

// Admin CMS
import AdminCMSTopics from './pages/cms/topics'

// Google Calendar
import GoogleCalendar from './pages/google/Calendar'

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {}
		}
	}

	componentDidMount() {
		axios.get(Config.api.auth.user, {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({user: res.data.user})
			}
		})
	}

	render() {
		return (
			<BrowserRouter>
				<React.Fragment>
					<Routes>
						<Route path={Config.links.home} exact element={<Home />} />
						<Route path={Config.links.contact} element={<Contact />} />
						<Route path={Config.links.shop.home} element={<Shop />} />
						<Route path={Config.links.shop.create} element={<ShopCreate page="追加"/>} />
						<Route path={Config.links.shop.edit} element={<ShopEdit />} />
						<Route path={Config.links.shop.views} element={<ShopViews />} />
						<Route path={Config.links.ec.home} element={<Ec />} />
						<Route path={Config.links.ec.product} element={<EcDetail />} />
						<Route path={Config.links.ec.cart} element={<EcCart />} />
						<Route path={Config.links.ec.favorites} element={<EcFavorites />} />
						<Route path={Config.links.ec.history} element={<EcHistory />} />
						<Route path={Config.links.ec.review} element={<EcReview />} />
						<Route path="/event" element={<Event />} />
						<Route path="/event/create" element={<EventEdit />} />
						<Route path="/event/category" element={<EventCategory />} />
						<Route path={Config.links.profile} element={<MyProfile user={this.state.user} />} />
						<Route path={Config.links.follow} element={<MyFollows user={this.state.user} />} />
						<Route path="/practice/stop-watch" element={<StopWatch />} />
						<Route path={Config.links.auth.login} element={<Login />} />
						<Route path={Config.links.auth.register} element={<Register />} />
						<Route path={Config.links.auth.forgot} element={<Forgot />} />
						<Route path={Config.links.auth.authorize} element={<Authorize />} />
						<Route path={Config.links.auth.password} element={<Password />} />
						<Route path={Config.links.cms.topics} element={<AdminCMSTopics user={this.state.user} />} />
						<Route path={Config.links.google.calendar} element={<GoogleCalendar user={this.state.user} />}/>
					</Routes>
				</React.Fragment>
			</BrowserRouter>
		)
	}
}

export default App;

if (document.getElementById('app')) {
	const container = document.getElementById('app')
	const root = createRoot(container)
	root.render(<App />)
}
