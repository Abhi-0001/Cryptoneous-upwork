import { useEffect, useState } from "react";
import Box from "../ui/Box";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants";
import { useAuth } from "../contexts/AuthProvider";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, token } = useAuth();
  if (!isLoggedIn) return <Navigate to="login" />;

  useEffect(function () {
    async function getTasks() {
      setIsLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/user/task`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log(res);
      } catch (e) {
        console.log(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    getTasks();
  }, []);

  return (
    <div className="p-4 w-[100%]">
      <div className="grid-cols-4 justify-between w-[70%]">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          tasks?.map((task) => {
            return (
              <Box>
                <img src={`${task}`} alt="task image" />
              </Box>
            );
          })
        )}
      </div>

      <button className="bg-zinc-200 block border-black-2 cursor-pointer ease-linear hover:bg-zinc-100 lg:h-24 lg:text-8xl lg:w-24 rounded-lg sm:text-xl text-zinc-400">
        +<span className="block text-xs">Add new Task</span>
      </button>
    </div>
  );
}
