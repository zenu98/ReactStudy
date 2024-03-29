import React, { useContext } from "react";
import { TodosContext } from "../store/todos-context";
import TodoList from "./TodoList";
import classes from "./Todos.module.css";

const Todos: React.FC = () => {
  const todoCtx = useContext(TodosContext);
  return (
    <ul className={classes.todos}>
      {todoCtx.items.map((item) => (
        <TodoList
          key={item.id}
          text={item.text}
          onRemoveTodo={todoCtx.removeTodo.bind(null, item.id)}
        />
      ))}
    </ul>
  );
};
export default Todos;
