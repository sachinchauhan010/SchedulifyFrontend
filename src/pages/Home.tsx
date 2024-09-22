import ScheduleTable from "@/components/ScheduleTable"

function Home() {
  // const handleCheck = async () => {
  //   await fetch(`${import.meta.env.VITE_PRODUCTION_URI}/api/faculty/faculty-get`, { credentials: 'include' })
  // }

  return (
    <div>
      {/* <button className="border border-red-900 p-3 m-3" onClick={handleCheck}>check Auth</button> */}
      <ScheduleTable />
    </div>
  )
}

export default Home
