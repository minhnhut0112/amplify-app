import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: newTodoCentent });
  }

  const [isEdit, setIsEdit] = useState<number | null>();
  const [todoCentent, setTodoContent] = useState<string>("");
  const [newTodoCentent, setNewTodoContent] = useState<string>("");

  const updateTodo = async (id: string, content: string) => {
    await client.models.Todo.update({ id, content });
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
              {isEdit !== Number(todo.id) ? (
                <>
                  <label htmlFor={String(todo.id)}>{todo.content}</label>
                  <div className="button-container">
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setIsEdit(Number(todo.id));
                        setTodoContent(String(todo.content));
                      }}
                    >
                      edit
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTodoContent(e.target.value)
                    }
                    className="todo-input"
                    type="text"
                    value={todoCentent}
                  />
                  <button
                    onClick={() => {
                      setIsEdit(null);
                      setTodoContent("");
                    }}
                    className="btn-close"
                  >
                    Close
                  </button>
                  <button className="btn-save">Save</button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>

      <hr />

      <form className="todo-form">
        <input
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
