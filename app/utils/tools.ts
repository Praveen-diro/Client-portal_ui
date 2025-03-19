import axios from "axios";

export const setAuthToken = (token: string | null): void => {
  if (token) {
    // Check if token already starts with "Bearer"
    const authToken = token.trim().startsWith("Bearer ") ? token : `Bearer ${token}`;
    axios.defaults.headers.common["Authorization"] = authToken;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};
