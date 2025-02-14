import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  Briefcase,
  Coins,
  Layers,
  LayoutDashboard,
  LayoutList,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DesktopNav() {
  return (
    <header className="border-b bg-white">
      <div className="flex h-14 items-center px-4 gap-8">
        <nav className="flex items-center justify-center w-[50px] h-full">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/bg/rumsan-logo.png"
              width={50}
              height={50}
              alt="Logo"
            />
          </Link>
        </nav>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-normal text-[#1E293B] hover:text-[#1e293b] transition-colors"
          >
            <LayoutDashboard size={18} strokeWidth={2.65} color="#334155" />
            Dashboard
          </Link>
          <Link
            href="/departments"
            className="flex items-center gap-2 text-sm font-normal text-[#1E293B] hover:text-[#1e293b] transition-colors"
          >
            <Layers size={18} strokeWidth={2.65} color="#334155" />
            Department
          </Link>
          <Link
            href="/participants"
            className="flex items-center gap-2 text-sm font-normal text-[#1E293B] hover:text-[#1e293b] transition-colors"
          >
            <Briefcase size={18} strokeWidth={2.65} color="#334155" />
            Task Management
          </Link>
          <Link
            href="/treasurer"
            className="flex items-center gap-2 text-sm font-normal text-[#1E293B] hover:text-[#1e293b] transition-colors"
          >
            <Coins size={18} strokeWidth={2.65} color="#334155" />
            History
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Link
            href="/tasks"
            className="flex items-center gap-2 text-sm font-normal text-[#1E293B] hover:text-[#1e293b] transition-colors"
          >
            <LayoutList
              size={18}
              strokeWidth={2.65}
              color="#334155"
              className=""
            />
            My Tasks
          </Link>
          <div className="flex items-center h-10 p-2 bg-[#F1F5F9] rounded-md">
            <span className="flex items-center gap-2 font-normal text-[#1E293B] text-sm">
              <Wallet size={18} strokeWidth={2.65} color="#334155" />{" "}
              67wdbb...383hd
            </span>
          </div>
          <Avatar className="bg-red-400 h-7 w-7">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
