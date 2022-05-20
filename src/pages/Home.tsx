import React, { useEffect, useRef, useState, useCallback } from "react";
import { RiCloseCircleLine } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";

function Home() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    const getTodos = async () => {
      const resp = await fetch('https://todolist-eox.pages.dev/api/todos');
      const todosResp = await resp.json();
      setTodos(todosResp);
    };

    getTodos();
    // set isMounted to false when we unmount the component
    return () => {
      isMounted.current = false;
    };
  }, []);

  const sendRequest = useCallback(async () => {
    // don't send again while we are sending
    if (isLoading) return;
    // update state
    setIsLoading(true);
    // send the actual request
    // await API.sendRequest();
    // only proceed if still in current component
    if (isMounted.current) {
      // once the request is sent, update state again
      setIsLoading(false);
    }
  }, [isLoading]); // update the callback if the state changes
  console.log(todos);
  
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
            />
            <button
              className="bg-green-500 px-2 py-1 rounded-md text-white font-semibold"
              disabled={isLoading}
            >
              create
            </button>
          </div>
        </div>
      </form>
      <div>
        <div className="flex justify-center">
          <div className=" relative justify-center mt-6">
            <div className="absolute flex top-0 right-0 p-3 space-x-1">
              <TiEdit size={25} />
              <RiCloseCircleLine size={25} />
            </div>
            <span className="absolute -left-3 -top-3 bg-green-500 flex justify-center items-center rounded-full w-8 h-8 text-gray-50 font-bold">
              9
            </span>
            <p className="bg-white px-12 py-8 rounded-lg w-80">
              simply dummy text of the printing and typesetting industry.{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
