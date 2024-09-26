import { useState, useEffect} from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"

import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { DialogDescription } from "@radix-ui/react-dialog"

export default function AuthDialog() {

  const { toast } = useToast()
  const {dispatch: dispatchAuthState} = useAuth() 


  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    id: '',
  })
  const [isRegistering, setIsRegistering] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setIsRegistering(false)
      setFormData({
        email: '',
        password: '',
        name: '',
        id: '',
      })
    }
  }, [isOpen])

  const handleDialogOpen = () => setIsOpen(true)
  const handleDialogClose = () => {
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prevData => ({ ...prevData, [id]: value }))
  }


  const handleSubmit = async () => {
    if (isRegistering) {
      try {
        const response = await fetch(`${import.meta.env.VITE_PRODUCTION_URI}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const apiresponse = await response.json();
        if (apiresponse.success) {
          toast({
            title: "Sign up: successfully",
            description: `Hello 🫱🏼‍🫲🏼 ${formData.name}`,
          })
          setFormData({
            email: '',
            password: '',
            name: '',
            id: '',
          })

        } else {
          toast({
            title: "Sign up: Failed",
            description: "try again",
          })
        }
      } catch (error) {
        console.log("Error in sending reguest to backend for sign up", error);
      }


      // Login request
    } else {
      try {
        const response = await fetch(`${import.meta.env.VITE_PRODUCTION_URI}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          credentials: 'include'
        })
        const apiresponse = await response.json()
        if (!apiresponse.success) {
          toast({
            title: "Login: Failed",
            description: apiresponse.message,
          })
          return;
        }
        dispatchAuthState({
          type:"LOGIN",
          payload: {
            name:formData?.name || ""
          }
        })
        toast({
          title: "Login: Successfully",
          description: `You have sign up via ${formData.email}`,
        })

        setFormData({
          email: '',
          password: '',
          name: '',
          id: '',
        })
      } catch (error) {
        console.log("Error in sending reguest to backend for login", error);
      }
    }
    handleDialogClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <p onClick={handleDialogOpen} className='text-right hover:cursor-pointer'>Login</p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className='text-center text-2xl'>{isRegistering ? 'Create an account' : 'Login'}</DialogTitle>
          <DialogDescription>Enter your email to sign up for this web application</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isRegistering &&
            <div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  className="col-span-3 rounded"
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mt-4">
                <Label htmlFor="id" className="text-right">
                  ID
                </Label>
                <Input
                  id="id"
                  value={formData.id}
                  className="col-span-3 rounded"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          }
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={formData.email}
              className="col-span-3 rounded"
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              value={formData.password}
              className="col-span-3 rounded"
              type="password"
              onChange={handleInputChange}
            />
          </div>

        </div>
        <DialogFooter className="flex justify-between item-center gap-x-48">
          <DialogClose asChild>
            <Button type="button" className="border-[1px] rounded" onClick={handleDialogClose}>Cancel</Button>
          </DialogClose>
          <Button type="button" className="rounded" onClick={handleSubmit}>
            {isRegistering ? 'Register' : 'Login'}
          </Button>
        </DialogFooter>
        <span onClick={() => setIsRegistering(!isRegistering)} className='text-right hover:cursor-pointer ml-auto'>
          {isRegistering ? 'Already account Login' : 'Register Now!..'}
        </span>
      </DialogContent>
    </Dialog>
  )
}
