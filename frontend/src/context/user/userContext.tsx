import { createContext } from 'react';

const TodoContext = createContext<ContextTypeUser | null>(null);

export default TodoContext;
