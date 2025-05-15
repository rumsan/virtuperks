'use client'

import { PATHS } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Page() {
  const router = useRouter();
 

  useEffect(() => {
  
      router.push(PATHS.TASKPORTAL.HOME);
 
  }, [router]);

 

 
 
  //       <ConnectKitButton />

 return null
}