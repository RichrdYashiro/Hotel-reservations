import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectUserLogin, selectUserRole } from '../selectors';
import { ROLE } from '../constants/role';

const HeaderContainer = ({ className }) => {
	const roleId = useSelector(selectUserRole);
	const login = useSelector(selectUserLogin);

	return (
		<header className={className}>
			<div className="logo">
				<Link to="/" className="logo-link">
					<span className="logo-icon">🎮</span>
					<span className="logo-text">PlayStation Store</span>
				</Link>
			</div>

			<nav className="nav-menu">
				<Link to="/" className="nav-link">
					Главная
				</Link>
				<Link to="/" className="nav-link">
					Игры
				</Link>
				<Link to="/" className="nav-link">
					Скидки
				</Link>
			</nav>

			<div className="user-section">
				{roleId === ROLE.READER ? (
					<div className="auth-buttons">
						<Link to="/authorization" className="auth-btn login">
							Вход
						</Link>
						<Link to="/registration" className="auth-btn register">
							Регистрация
						</Link>
					</div>
				) : roleId === ROLE.USER ? (
					<div className="user-info">
						<span className="welcome">Привет, {login}!</span>
						<Link to="/profile" className="profile-link">
							Профиль
						</Link>
					</div>
				) : roleId === ROLE.ADMIN ? (
					<div className="admin-info">
						<span className="admin-badge">👑 Админ</span>
						<span className="admin-name">{login}</span>
						<Link to="/adminprofile" className="admin-link">
							Панель управления
						</Link>
					</div>
				) : null}
			</div>
		</header>
	);
};

export const Header = styled(HeaderContainer)`
	position: sticky;
	top: 0;
	z-index: 1000;
	height: 80px;
	padding: 0 30px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(20px);
	border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

	.logo {
		.logo-link {
			display: flex;
			align-items: center;
			gap: 12px;
			text-decoration: none;
			transition: all 0.3s ease;

			&:hover {
				transform: scale(1.05);
			}
		}

		.logo-icon {
			font-size: 2rem;
			animation: pulse 2s ease-in-out infinite;
		}

		.logo-text {
			font-size: 1.5rem;
			font-weight: 800;
			background: linear-gradient(45deg, #667eea, #764ba2, #f093fb);
			background-size: 200% 200%;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
			animation: shimmer 3s ease-in-out infinite;
		}
	}

	.nav-menu {
		display: flex;
		gap: 30px;

		.nav-link {
			color: rgba(255, 255, 255, 0.8);
			text-decoration: none;
			font-weight: 600;
			font-size: 1rem;
			padding: 8px 16px;
			border-radius: 20px;
			transition: all 0.3s ease;
			position: relative;

			&::before {
				content: '';
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 0;
				height: 2px;
				background: linear-gradient(90deg, #667eea, #764ba2);
				transition: width 0.3s ease;
			}

			&:hover {
				color: white;
				background: rgba(255, 255, 255, 0.1);
				transform: translateY(-2px);

				&::before {
					width: 80%;
				}
			}
		}
	}

	.user-section {
		.auth-buttons {
			display: flex;
			gap: 15px;

			.auth-btn {
				padding: 10px 20px;
				border-radius: 25px;
				text-decoration: none;
				font-weight: 600;
				transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
				position: relative;
				overflow: hidden;

				&::before {
					content: '';
					position: absolute;
					top: 0;
					left: -100%;
					width: 100%;
					height: 100%;
					background: linear-gradient(
						90deg,
						transparent,
						rgba(255, 255, 255, 0.2),
						transparent
					);
					transition: left 0.5s;
				}

				&:hover::before {
					left: 100%;
				}

				&.login {
					background: rgba(255, 255, 255, 0.1);
					border: 1px solid rgba(255, 255, 255, 0.3);
					color: white;

					&:hover {
						background: rgba(255, 255, 255, 0.2);
						transform: translateY(-2px);
						box-shadow: 0 10px 25px rgba(255, 255, 255, 0.2);
					}
				}

				&.register {
					background: linear-gradient(45deg, #667eea, #764ba2);
					color: white;
					border: none;

					&:hover {
						transform: translateY(-2px);
						box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
						background: linear-gradient(45deg, #764ba2, #667eea);
					}
				}
			}
		}

		.user-info {
			display: flex;
			align-items: center;
			gap: 15px;

			.welcome {
				color: rgba(255, 255, 255, 0.8);
				font-weight: 600;
			}

			.profile-link {
				padding: 8px 16px;
				background: linear-gradient(45deg, #667eea, #764ba2);
				color: white;
				text-decoration: none;
				border-radius: 20px;
				font-weight: 600;
				transition: all 0.3s ease;

				&:hover {
					transform: translateY(-2px);
					box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
				}
			}
		}

		.admin-info {
			display: flex;
			align-items: center;
			gap: 15px;

			.admin-badge {
				background: linear-gradient(45deg, #ffd700, #ffed4e);
				color: #333;
				padding: 6px 12px;
				border-radius: 15px;
				font-weight: 700;
				font-size: 0.9rem;
				animation: pulse 2s ease-in-out infinite;
			}

			.admin-name {
				color: rgba(255, 255, 255, 0.8);
				font-weight: 600;
			}

			.admin-link {
				padding: 8px 16px;
				background: linear-gradient(45deg, #ff6b6b, #ee5a24);
				color: white;
				text-decoration: none;
				border-radius: 20px;
				font-weight: 600;
				transition: all 0.3s ease;

				&:hover {
					transform: translateY(-2px);
					box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);
				}
			}
		}
	}

	@media (max-width: 768px) {
		padding: 0 15px;
		height: 70px;

		.logo .logo-text {
			display: none;
		}

		.nav-menu {
			display: none;
		}

		.user-section {
			.auth-buttons {
				gap: 10px;

				.auth-btn {
					padding: 8px 15px;
					font-size: 0.9rem;
				}
			}

			.user-info,
			.admin-info {
				gap: 10px;

				.welcome,
				.admin-name {
					display: none;
				}
			}
		}
	}
`;
