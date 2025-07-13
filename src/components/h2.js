import styled from "styled-components"
const h2Container = ({ className, children }) => { 
    return (
        <h2 className={className}>
            {children}
        </h2>
    )
}

export const H2 = styled(h2Container)`
text-align: center;
margin:20px auto;

`