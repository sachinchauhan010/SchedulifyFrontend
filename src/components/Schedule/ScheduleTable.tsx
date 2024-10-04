import { useEffect, useState } from "react";
import { getDate, getDay } from "@/utils/getDay";

import { useToast } from "@/hooks/use-toast"
import { Switch } from "../ui/switch";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

interface ScheduleTableProps {
  schedule: TimetableData | null;
}

function ScheduleTable({ schedule }: ScheduleTableProps) {
  const currentDay = getDay().name;
  const currentDate = getDate();
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const { toast } = useToast()

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_PRODUCTION_URI}/api/faculty/today-attendence`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              currDate: currentDate,
              currDay: currentDay,
            }),
          }
        );
        const apiResponse = await response.json();
        if (apiResponse.success) {
          const initialAttendance: Record<string, boolean> = {};
          apiResponse.attendence.forEach((record: any) => {
            initialAttendance[record.periodId] = record.attended;
          });
          setAttendance(initialAttendance);
          setSubmitted(apiResponse.submitted);

        }
      } catch (error: any) {
        console.log(error.message);
      }
    };

    if (schedule) {
      fetchAttendance();
    }
  }, [schedule, currentDate, currentDay]);

  const handleSwitchChange = async (isChecked: boolean, periodId: string) => {
    if (submitted) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_PRODUCTION_URI}/api/faculty/update-attendence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          periodId,
          date: currentDate,
          status: isChecked ? "yes" : "no",
        }),
      });

      const apiResponse = await response.json();
      if (apiResponse.success) {
        setAttendance((prevStatus) => ({
          ...prevStatus,
          [periodId]: isChecked,
        }));
        toast({
          title: "Class schedule updated successfully",
          description: `${apiResponse.message}`,
        })
      } else {
        toast({
          title: "Class schedule is not updated successfully",
          description: `${apiResponse.message}`,
        })
        console.log("Failed to save attendance");
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="text-2xl text-center w-full">Track My Class</div>
      {schedule?.schedule.map((daySchedule, index) => (
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
                  <TableCaption className="">
                    <div className="flex justify-around items-center">
                      <p>Your schedule for {daySchedule.day}</p>
                      {/* <Button onClick={handleSubmitAttendance}>Submit</Button> */}
                    </div>
                  </TableCaption>
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
                      daySchedule.periods.map((periodItem, idx) => {
                        const isAttended = attendance[periodItem.periodId] ?? true;
                        return (
                          <TableRow
                            key={idx}
                            className={daySchedule.day === currentDay
                              ? (isAttended
                                ? "border-[1px] border-green-600 bg-green-800 rounded"
                                : "border-[1px] border-red-600 bg-red-200 rounded")
                              : ""}
                            style={{
                              background: isAttended
                                ? "linear-gradient(to bottom, #5a3f37, #2c7744)"
                                : "linear-gradient(to bottom,#d64c7f,#ee4758 50%)"
                            }}
                          >
                            <TableCell>{periodItem.period}</TableCell>
                            <TableCell>{periodItem.time}</TableCell>
                            <TableCell>{periodItem.subject}</TableCell>
                            <TableCell>{periodItem.course}</TableCell>
                            <TableCell>{periodItem.semester}</TableCell>
                            <TableCell>{periodItem.batch}</TableCell>
                            <TableCell>{periodItem.classType}</TableCell>
                            <TableCell>{periodItem.hallName}</TableCell>
                            <TableCell>
                              <Switch
                                id={`switch-${periodItem.periodId}`}
                                checked={isAttended}
                                onCheckedChange={(isChecked) =>
                                  handleSwitchChange(isChecked, periodItem.periodId)
                                }
                                disabled={submitted}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
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
