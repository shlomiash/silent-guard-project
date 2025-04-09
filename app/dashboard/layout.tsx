import SideBar from "@/components/dashboard/sidebar/sidebar";
import RightSide from "@/components/dashboard/camera-side/right-side";

export default function DashboardLayout({children} : {children: React.ReactNode}) {
  return (
    <div className=" h-full w-full flex">
        <div className="left-side-bar  w-1/6 h-full border-r-2 border-slate-400">
          <SideBar/>
        </div>
        <div className="right-side-bar w-full h-full">
         {children}
        </div>
    </div>
  );
}