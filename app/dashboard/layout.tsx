//Imports UI
import SideBar from "@/components/dashboard/sidebar/sidebar";
import NotUser from "@/components/auth/not-user";

//Imports Auth
import { auth } from "@/auth";

// Context
import { CategoryModeProvider } from "@/components/context/mode-context";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    return <NotUser />;
  }

  return (
    <CategoryModeProvider>
      <div className="h-full w-full flex">
        <div className="left-side-bar w-1/6 h-full border-r-2 border-slate-400">
          <SideBar />
        </div>
        <div className="right-side-bar w-full h-full">
          {children}
        </div>
      </div>
    </CategoryModeProvider>
  );
}
