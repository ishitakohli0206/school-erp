const logout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  navigate("/login");
};

export { logout };
