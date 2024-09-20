import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"


function Avtar() {
  const [name, setName] =useState(null)

  async function fetchName() {
    const response = await fetch(`${import.meta.env.VITE_PRODUCTION_URI}/api/faulty/getusername`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    const apiresponse=await response.json();

    if(apiresponse.success){
      setName(apiresponse.userData)
    }
    console.log("Called")
  }

  useEffect(()=>{
   fetchName();
   console.log(name)
  }, [])

  return (
    <>
    <DropdownMenu>

      <DropdownMenuTrigger>
        Name: {name}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}

export default Avtar
