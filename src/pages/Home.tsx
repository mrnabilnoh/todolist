import React, { useEffect, useRef, useState, useCallback} from "react";
import Card from "../components/Card";

function Home() {
  const isMounted = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState({
    todos: [],
    title: "",
    isLoading: false,
  });

  useEffect(() => {
    if (inputRef.current != null) {
      inputRef.current.focus();
    }
    const getTodos = async () => {
      // todo: can improve more, maybe read it from 'env', so can make the domain name dynamic
      const resp = await fetch("https://todolist-eox.pages.dev/api/todos");
      const todosResp = await resp.json();
      setState((prevState) => ({
        ...prevState,
        todos: todosResp,
      }));
    };

    getTodos();
    // set isMounted to false when we unmount the component
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      title: e.target.value
    }));
  };

  const sendRequest = useCallback(async () => {
    // don't send again while we are sending
    if (state.isLoading) return;
    // update state
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    console.log(state.title);
    
    // send the actual request
    // await API.sendRequest();
    // only proceed if still in current component
    if (isMounted.current) {
      // once the request is sent, update state again
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }
  }, [state]); // update the callback if the state changes

  return (
    <div>
      <form className="flex justify-center mt-10">
        <div className="bg-gray-50 p-8 rounded-lg">
          <h1 className="text-center mb-4">Write Todo List</h1>
          <div className="flex space-x-2 p-2 bg-white rounded-md">
            <input
              type="text"
              placeholder="Write here..."
              className="w-full outline-none"
              onChange={handleChange}
              ref={inputRef}
            />
            <button
              className="bg-green-500 px-2 py-1 rounded-md text-white font-semibold"
              disabled={state.isLoading || state.title.length === 0}
              onClick={sendRequest}
            >
              create
            </button>
          </div>
        </div>
      </form>
      <div>
        <Card items={state.todos} />
      </div>
    </div>
  );
}

export default Home;
