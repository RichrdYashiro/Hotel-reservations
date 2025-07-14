import styled from "styled-components"
const RoomItemContainer = ({className, children}) => {
    return (
        <div className={className}>{children}</div>
 )
}

export const RoomItem = styled(RoomItemContainer)`
border: 4px solid wheat;
    border-radius: 11px;
    background-color: #dddddd52;
    padding: 2px 10px;
`;