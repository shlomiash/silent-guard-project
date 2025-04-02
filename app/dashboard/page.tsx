import SideBar from "@/components/dashboard/sidebar/sidebar";

export default function Dashboard() {
  return (
    <div className=" h-full w-full flex space-x-2">
        <div className="left-side-bar  w-1/6 h-full border-r-2 border-slate-400">
          <SideBar/>
        </div>
        <div className="right-side-bar w-full h-full">
          Right side bar
        </div>
    </div>
  );
}
