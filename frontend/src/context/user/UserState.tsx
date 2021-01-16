import { useReducer } from 'react';
import UserContext from './userContext';
import UserReducer from './userReducer';

// Apollo graphql
import { useMutation, gql } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      code
      success
      message
      user {
        id
        name
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!) {
    addUser(name: $name, email: $email, password: $password) {
      code
      success
      message
      user {
        id
        name
      }
    }
  }
`;

const TodoState: React.FC<React.ReactNode> = ({ children }) => {
  const initialState: InitialStateUser = {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(UserReducer, initialState);

  const [loginUser] = useMutation(LOGIN_MUTATION);
  const [addUser] = useMutation(REGISTER_MUTATION);

  // Login user
  const login: LoginFunction = ({ email, password }) => {
    // console.log(email, password);
    loginUser({ variables: { email, password } }).then(({ data }) => {
      if (data.loginUser.code === '200') {
        dispatch({
          type: 'LOGIN_USER',
          payload: data.loginUser,
        });
      } else {
        dispatch({
          type: 'LOGIN_FAIL',
          payload: data.loginUser.message,
        });
      }
    });
  };

  // Register user
  const register: RegisterFunction = ({ name, email, password }) => {
    // console.log(email, password);
    addUser({ variables: { name, email, password } }).then(({ data }) => {
      if (data.addUser.code === '201') {
        dispatch({
          type: 'REGISTER_USER',
          payload: data.addUser,
        });
      } else {
        dispatch({
          type: 'REGISTER_FAIL',
          payload: data.addUser.message,
        });
      }
    });
  };

  //Logs the user out, retarts state
  const logout = (): void => dispatch({ type: 'LOGOUT' });

  // Clears all the error messages returned by server
  const clearErrors = (): void => {
    dispatch({
      type: 'CLEAR_ERRORS',
    });
  };

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        login,
        clearErrors,
        register,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default TodoState;
