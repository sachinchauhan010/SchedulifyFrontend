import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";

import ScheduleTable from "@/components/Schedule/ScheduleTable";

type Period = {
  period: string;
  time: string;
  subject: string;
  course: string;
  semester: number;
  batch: string;
  classType: string;
  hallName: string;
  periodId: string;
  classesAttended: number;
  attendanceRecords: Record<string, string>;
};


type DaySchedule = {
  day: string;
  periods: Period[];
};

type TimetableData = {
  timetableId: string;
  schedule: DaySchedule[];
};

function Schedule() {
  const { authState } = useAuth();
  const [schedule, setSchedule] = useState<TimetableData | null>(null);

  useEffect(() => {
    setDefaultAttendence()
  }, [])

  useEffect(() => {
    if (authState?.isLoggedIn) {
      fetchSchedule();
    }
  }, [authState?.isLoggedIn]);

  const setDefaultAttendence = async () => {
    const response = await fetch(`${import.meta.env.VITE_PRODUCTION_URI}/api/faculty/set-default-attendence`,
      {
        credentials: 'include'
      })
    await response.json()
  }

  async function fetchSchedule() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PRODUCTION_URI}/api/faculty/getschedule`,
        {
          credentials: "include",
        }
      );
      const apiResponse = await response.json();
      if (!apiResponse.success) {
        console.log("Failed to fetch the data");
        setSchedule(null);
        return;
      }
      setSchedule(apiResponse.data);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  }

  if (!schedule) {
    return <div>No schedule available</div>;
  }

  return (
    <div>
      <ScheduleTable schedule={schedule}/>
    </div>
  )
}

export default Schedule
