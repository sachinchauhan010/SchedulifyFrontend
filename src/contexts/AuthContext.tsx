import React, { createContext, ReactNode, useContext, useReducer } from "react";

interface AuthContextType {
  authState: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

interface AuthState {
  name: string;
  isLoggedIn: boolean;
}

type AuthAction =
  | { type: "LOGIN"; payload: { name: string } }
  | { type: "LOGOUT" };

const initialState: AuthState = {
  isLoggedIn: false,
  name: ""
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isLoggedIn: true, name: action.payload.name };
    case "LOGOUT":
      return { ...state, isLoggedIn: false, name: "" };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ authState, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Auth context not provided");
  }
  return context;
};