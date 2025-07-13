import styled from "styled-components"
import { H2 } from "../components";

const HomeContainer = ({ className }) => { 
    return (
        <div className={className}>
            <H2>Главная страница</H2>
        </div>  
);
}
export const Home = styled(HomeContainer)`
display:flex;
`;