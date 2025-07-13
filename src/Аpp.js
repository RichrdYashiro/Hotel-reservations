import styles from './app.module.css';
import styled from 'styled-components';

const DIV = styled.div`
	color: red;
`;
export const App = () => {
	return (
		<div className="App">
			<header className="App-header">
				<DIV>DIVnpm</DIV>
			</header>
		</div>
	);
};
