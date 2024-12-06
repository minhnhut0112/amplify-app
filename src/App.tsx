import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);
  const [todoIsEdit, setTodoIsEdit] = useState<string | null>();
  const [todoCentent, setTodoContent] = useState<string>("");
  const [newTodoCentent, setNewTodoContent] = useState<string>("");

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  const fetchTodos = async () => {
    const { data: items } = await client.models.Todo.list();
    setTodos(items);
  };

  async function createTodo() {
    await client.models.Todo.create({ content: newTodoCentent });
  }

  const updateTodo = async (id: string, content: string) => {
    await client.models.Todo.update({ id, content });
    await fetchTodos();
    setTodoIsEdit(null);
  };

  const deleteTodo = async (id: string) => {
    await client.models.Todo.delete({ id });
  };

  return (
    <main>
      <h1>My todos app</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <div className="item-container">
              {todoIsEdit !== todo.id ? (
                <>
                  <label htmlFor={String(todo.id)}>
                    {todoCentent && todoIsEdit === todo.id
                      ? todoCentent
                      : todo.content}
                  </label>
                  <div className="button-container">
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setTodoIsEdit(todo.id);
                        setTodoContent(String(todo.content));
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <form
                  className="change-container"
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateTodo(todo.id, todoCentent);
                  }}
                >
                  <input
                    autoFocus
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTodoContent(e.target.value)
                    }
                    className="todo-input"
                    type="text"
                    value={todoCentent}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setTodoIsEdit(null);
                      setTodoContent("");
                    }}
                    className="btn-close"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn-save">
                    Save
                  </button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>

      <hr />

      <form className="todo-form">
        <input
          className="new-todo-input"
          autoFocus
          value={newTodoCentent}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewTodoContent(e.target.value)
          }
          id="todoName"
          type="text"
          placeholder="Add a todo"
        />
        <button onClick={createTodo}>Add a todo</button>
      </form>
    </main>
  );
}

export default App;
