import styled from "styled-components"
import { H2 } from "../components";

const RegistrationContainer = ({ className }) => { 
    return (
        <div className={className}>
            <H2>Регистрация</H2>
        </div>  
);
}
export const Registration = styled(RegistrationContainer)`
display:flex;
`;