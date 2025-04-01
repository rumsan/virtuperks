"use client";

import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import MyTaskListMain from "@/components/my-tasks/list";

function Page() {
  const router = useRouter()
  return <MyTaskListMain router={router} />
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
})
