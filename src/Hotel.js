
import { Routes, Route } from 'react-router-dom';
import { Header } from './components';
import { AdminProfile, Authorization, Home, Profile, Registration, RoomDetails } from './pages';
export const Hotel = () => {
	return (
		<>
			<Header />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path="/room/:id" element={<RoomDetails />} />
				<Route path='/authorization' element={<Authorization />} />
				<Route path='/registration' element={<Registration/>} />
				<Route path='/profile' element={<Profile/>} />
				<Route path='/adminprofile' element={<AdminProfile />} />
				<Route path='*' element="404" />
			</Routes>
		</>
	)
};
