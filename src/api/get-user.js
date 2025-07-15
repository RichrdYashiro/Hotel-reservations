export const GetUser = async (FindLogin) => {
    const response = await fetch(`http://localhost:3005/users?login=${FindLogin}`);
    const users = await response.json();
 return users[0]   
}