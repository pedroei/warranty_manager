// Interfaces for props

interface InvoicesProps {
  invoices: Invoice[];
}

interface routerParams {
  id: string;
}

// Object Types
type Invoice = {
  id: int;
  title: string;
  storeName: string;
  storeUrl: string;
  document: string;
  warrantyFinalDate: string;
};

type User = {
  id: int;
  name: string;
  email: string;
  password: string;
};

// Context
type ContextTypeUser = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: LoginFunction;
  clearErrors: () => void;
  register: RegisterFunction;
  logout: () => void;
  auth: AuthFunction;
};

type ContextStateUser = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

type InitialStateUser = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

type ActionUser =
  | { type: 'LOGIN_USER'; payload: any }
  | { type: 'LOGIN_FAIL'; payload: any }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'REGISTER_USER'; payload: any }
  | { type: 'REGISTER_FAIL'; payload: any }
  | { type: 'LOGOUT' }
  | { type: 'AUTH'; payload: any };

type LoginFunction = (userLogin: { email: string; password: string }) => void;
type RegisterFunction = (userRegister: {
  name: string;
  email: string;
  password: string;
}) => void;

type AuthFunction = () => void;
