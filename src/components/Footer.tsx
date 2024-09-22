import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div className='flex justify-between items-center'>
      <p className="text-xl font-semibold"><span className="text-[#03dac5]">T</span>rack<span className="text-[#03dac5]">M</span>Y<span className="text-[#03dac5]">C</span>lass</p>
      <div>
        <p>Links</p>
        <div className='flex flex-col items-center justify-center'>
          <Link to="/">Home</Link>
          <Link to="/">About</Link>
        </div>
      </div>
      <div>
        <p>Devlopers</p>
        <div className='flex flex-col items-center justify-center'>
          <Link to={"https://github.com/sachinchauhan010"}>Sachin Chauhan</Link>
          <Link to={"https://github.com/alokVerma749"}>Alok Verma (Contributor)</Link>
        </div>
      </div>
    </div>
  )
}

export default Footer
