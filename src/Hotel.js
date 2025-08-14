import { Routes, Route } from 'react-router-dom';
import { Header } from './components';
import {
	AdminProfile,
	Authorization,
	Home,
	Profile,
	Registration,
	GameDetails,
} from './pages';
export const Hotel = () => {
	return (
		<>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/game/:id" element={<GameDetails />} />
				<Route path="/authorization" element={<Authorization />} />
				<Route path="/registration" element={<Registration />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/adminprofile" element={<AdminProfile />} />
				<Route path="*" element="404" />
			</Routes>
		</>
	);
};
