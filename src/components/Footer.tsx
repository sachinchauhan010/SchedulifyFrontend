import { Link } from 'react-router-dom'
import { Separator } from "@/components/ui/separator"

function Footer() {
  return (
    <div className='mt-20'>
      <Separator />
      <div className='flex justify-between items-start pt-6'>
        <Link to={"/"} className="text-xl font-semibold"><span className="text-[#03dac5]">T</span>rack<span className="text-[#03dac5]">M</span>Y<span className="text-[#03dac5]">C</span>lass</Link>
        <div>
          <p>Links</p>
          <div className='flex flex-col items-center justify-start text-sm'>
            <Link to="/">Home</Link>
            <Link to="/">About</Link>
          </div>
        </div>
        <div>
          <p>Devlopers</p>
          <div className='flex flex-col items-start justify-center text-sm'>
            <Link to={"https://github.com/sachinchauhan010"}>Sachin Chauhan</Link>
            <Link to={"https://github.com/alokVerma749"}>Alok Verma(Contributor)</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
