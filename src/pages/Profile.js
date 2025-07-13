import styled from "styled-components"
import { H2 } from "../components";

const ProfileContainer = ({ className }) => { 
    return (
        <div className={className}>
            <H2>Отмена бронирования</H2>
        </div>  
);
}
export const Profile = styled(ProfileContainer)`
display:flex;
`;