import { GetUser } from "../api/get-user";

export const Authorizate = async (login, password) => {
  const user = await GetUser(login);
  if (!user) return null;

  if (user.password === password) {
    return user;
  }

  return null;
};