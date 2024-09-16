import { useState, useEffect } from "react"

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
  

  const handleSubmit = () => {
    if (isRegistering) {
      console.log('Registering with data:', formData)
    } else {
      console.log('Logging in with data:', formData)
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
        <div onClick={() => setIsRegistering(!isRegistering)} className='text-right hover:cursor-pointer'>
          {isRegistering ? 'Already account Login' : 'Register Now!..'}
        </div> 
      </DialogContent>
    </Dialog>
  )
}
