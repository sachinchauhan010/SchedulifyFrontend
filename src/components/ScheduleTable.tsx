import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { getDate, getDay } from "@/utils/getDay";

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
  attendanceRecords: Record<string, string>; // e.g., { "2024-09-20": "yes" }
};

type DaySchedule = {
  day: string;
  periods: Period[];
};

type TimetableData = {
  timetableId: string;
  schedule: DaySchedule[];
};

function ScheduleTable() {
  const [schedule, setSchedule] = useState<TimetableData | null>(null);
  const { authState } = useAuth();

  const currentDay = getDay().name;
  const currentDate = getDate();

  useEffect(() => {
    if (authState?.isLoggedIn) {
      fetchSchedule();
    }
  }, [authState?.isLoggedIn]);

  const handleRadioChange = async (
    value: string,
    day: string,
    periodId: string
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PRODUCTION_URI}/api/faculty/update-attendence`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            periodId,
            date: currentDate, // Pass the current date
            status: value, // "yes" or "no"
          }),
        }
      );

      const apiResponse = await response.json();
      if (apiResponse.success) {
        // Update the local state to reflect the change in attendance
        setSchedule((prevSchedule) => {
          if (!prevSchedule) return prevSchedule;

          // Find the day in the schedule and update the attendanceRecords
          const updatedSchedule = prevSchedule.schedule.map((daySchedule) => {
            if (daySchedule.day === day) {
              const updatedPeriods = daySchedule.periods.map((period) => {
                if (period.periodId === periodId) {
                  return {
                    ...period,
                    attendanceRecords: {
                      ...period.attendanceRecords,
                      [currentDate]: value, // Update the attendance for the current date
                    },
                  };
                }
                return period;
              });
              return { ...daySchedule, periods: updatedPeriods };
            }
            return daySchedule;
          });

          return { ...prevSchedule, schedule: updatedSchedule };
        });
      } else {
        console.log("Failed to save attendance");
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
    }
  };

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
    <div className="w-full">
      <div className="text-2xl text-center w-full">Track My Class</div>
      {schedule.schedule.map((daySchedule, index) => (
        <div key={index}>
          <Accordion
            type="single"
            collapsible
            defaultValue={daySchedule.day === currentDay ? "item-" + daySchedule.day : ""}
          >
            <AccordionItem value={"item-" + daySchedule.day}>
              <AccordionTrigger>{daySchedule.day}</AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableCaption>Your schedule for {daySchedule.day}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Class Type</TableHead>
                      <TableHead>Hall Name</TableHead>
                      <TableHead>Want to Attend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {daySchedule.periods && daySchedule.periods.length > 0 ? (
                      daySchedule.periods.map((periodItem, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{periodItem.period}</TableCell>
                          <TableCell>{periodItem.time}</TableCell>
                          <TableCell>{periodItem.subject}</TableCell>
                          <TableCell>{periodItem.course}</TableCell>
                          <TableCell>{periodItem.semester}</TableCell>
                          <TableCell>{periodItem.batch}</TableCell>
                          <TableCell>{periodItem.classType}</TableCell>
                          <TableCell>{periodItem.hallName}</TableCell>
                          <TableCell>
                            <RadioGroup
                              defaultValue={periodItem.attendanceRecords[currentDate] || "yes"}
                              onValueChange={(value) =>
                                handleRadioChange(value, daySchedule.day, periodItem.periodId)
                              }
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id={`yes-${idx}`} />
                                <Label htmlFor={`yes-${idx}`}>Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id={`no-${idx}`} />
                                <Label htmlFor={`no-${idx}`}>No</Label>
                              </div>
                            </RadioGroup>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center">
                          No schedule available for {daySchedule.day}.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  );
}

export default ScheduleTable;
