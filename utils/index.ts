export const getUserData = () => {
  let userData = null;
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("idTokenPayload");
    if (data) {
      userData = JSON.parse(data);
    }
  }
  return userData;
};

export const updateUserData = (userData: any) => {
  localStorage.setItem("idTokenPayload", JSON.stringify(userData));
};

export const getUserToken = () => {
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("accessToken");
  }
  return token;
};
