import styled from "styled-components"
import { H2 } from "../components";

const AdminProfileContainer = ({ className }) => { 
    return (
        <div className={className}>
            <H2>Админ панель</H2>
        </div>  
);
}
export const AdminProfile = styled(AdminProfileContainer)`
display:flex;
`;