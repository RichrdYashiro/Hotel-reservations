import styled from "styled-components"

const InputContainer = ({ className, ...props }) => {
    return (
        <input className={className} {...props}></input>
)
}

export const Input = styled(InputContainer)`
    border: 4px solid wheat;
    border-radius: 11px;
    height: 30px;
    background-color: #dddddd52;
    padding: 2px 10px;
`;