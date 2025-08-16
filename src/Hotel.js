import { Routes, Route, useNavigate } from 'react-router-dom';
import { Header } from './components';
import StarBackground from './components/StarBackground';
import {
	AdminProfile,
	Authorization,
	Home,
	Profile,
	Registration,
	GameDetails,
} from './pages';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from './operation/authorizate';
import { setUser } from './actions/user';

export const Hotel = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Проверка сессии при загрузке приложения
	useEffect(() => {
		const verifySession = async () => {
			const result = await checkAuth();
			if (!result.error) {
				dispatch(setUser(result.res));
			}
		};

		verifySession();
	}, [dispatch]);

	return (
		<>
			<StarBackground />
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
