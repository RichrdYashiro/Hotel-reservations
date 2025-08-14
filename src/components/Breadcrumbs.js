import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const BreadcrumbsContainer = ({ className }) => {
	const location = useLocation();
	const pathnames = location.pathname.split('/').filter((x) => x);

	const getBreadcrumbName = (path) => {
		switch (path) {
			case 'game':
				return 'Игра';
			case 'authorization':
				return 'Авторизация';
			case 'registration':
				return 'Регистрация';
			case 'profile':
				return 'Личный кабинет';
			case 'admin':
				return 'Админ панель';
			default:
				return path.charAt(0).toUpperCase() + path.slice(1);
		}
	};

	return (
		<nav className={className}>
			<Link to="/" className="breadcrumb-item">
				Главная
			</Link>
			{pathnames.map((name, index) => {
				const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
				const isLast = index === pathnames.length - 1;

				return (
					<span key={name}>
						<span className="separator">/</span>
						{isLast ? (
							<span className="breadcrumb-item active">
								{getBreadcrumbName(name)}
							</span>
						) : (
							<Link to={routeTo} className="breadcrumb-item">
								{getBreadcrumbName(name)}
							</Link>
						)}
					</span>
				);
			})}
		</nav>
	);
};

export const Breadcrumbs = styled(BreadcrumbsContainer)`
	display: flex;
	align-items: center;
	font-size: 0.9rem;
	margin-bottom: 20px;
	padding: 10px 0;
	color: rgba(255, 255, 255, 0.7);

	.breadcrumb-item {
		color: rgba(255, 255, 255, 0.7);
		text-decoration: none;
		transition: all 0.3s ease;
		font-weight: 500;

		&:hover {
			color: #667eea;
			text-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
		}

		&.active {
			color: #667eea;
			font-weight: 600;
		}
	}

	.separator {
		margin: 0 8px;
		color: rgba(255, 255, 255, 0.4);
	}

	@media (max-width: 768px) {
		font-size: 0.8rem;
		margin-bottom: 15px;
	}
`;

