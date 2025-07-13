import styled from "styled-components"
import { H2 } from "../components";

const AuthorizationContainer = ({ className }) => { 
    return (
        <div className={className}>
            <H2>Авторизация</H2>
        </div>  
);
}
export const Authorization = styled(AuthorizationContainer)`
display:flex;
`;