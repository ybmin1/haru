import { useGoalStore } from "@/stores/useGoalStore";

export default function Header() {
  const { isDemo, toggleDemoData } = useGoalStore();

  const handleClickToggle = () => {
    toggleDemoData();
  };

  return (
    <header className="flex flex-col h-[70px] border border-gray-200">
      <div className="relative flex item-center justify-center w-full h-10 bg-pink-700 overflow-hidden">
        <div
          className={`
    absolute inset-0 flex items-center justify-center text-white
    transition-all duration-400 ease-in-out
    ${isDemo ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
  `}
        >
          Demo Mode: Example Goals
        </div>
        <div
          className={`
    absolute inset-0 flex items-center justify-center text-white
    transition-all duration-400 ease-in-out
    ${!isDemo ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
  `}
        >
          Your Goals
        </div>
      </div>
      <div className="flex items-center justify-center h-full gap-2">
        <button
          onClick={handleClickToggle}
          className={`${
            isDemo ? "text-pink-700" : "text-black"
          } cursor-pointer`}
        >
          Demo
        </button>
        <div className="relative flex items-center w-[50px] h-[30px] rounded-2xl bg-gray-300">
          <button
            onClick={toggleDemoData}
            className={`absolute left-[1px] ${
              isDemo ? "translate-x-0" : "translate-x-[24px]"
            } w-[24px] h-[24px] rounded-2xl bg-white shadow-md shadow-black/35
         transition-all duration-300 ease-in-out cursor-pointer`}
          ></button>
        </div>
        <button
          onClick={handleClickToggle}
          className={`${
            !isDemo ? "text-pink-700" : "text-black"
          } cursor-pointer`}
        >
          User
        </button>
      </div>
    </header>
  );
}
