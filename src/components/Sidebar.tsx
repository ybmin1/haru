import { EmptyFinalGoal, FinalGoal } from "@/types/goal";
import { useGoalSource } from "@/stores/useGoalStore";

import Link from "next/link";

import { HiOutlineHome } from "react-icons/hi";
import { LuSettings } from "react-icons/lu";

export default function Sidebar() {
  const { finalGoal } = useGoalSource();

  const finalGoalData: FinalGoal | EmptyFinalGoal = finalGoal ?? {
    title: "Set your final goal",
  };

  return (
    <div className="w-full h-full">
      <div className="p-2">
        <div className="flex flex-col gap-1 my-5">
          <Link href={"/"} className="flex items-center gap-1">
            <span className="text-gray-400">
              <HiOutlineHome />
            </span>
            <span>Home</span>
          </Link>
          <Link href={"/goal-setup"} className="flex items-center gap-1">
            <span className="text-gray-400">
              <LuSettings />
            </span>
            <span>Set Up Goals</span>
          </Link>
        </div>
        <div>
          <div className="text-gray-400 mb-1">Goals</div>
          <div className="w-full truncate">
            <span>Goal 1.</span>
            <span>{finalGoalData.title}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
