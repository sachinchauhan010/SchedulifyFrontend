import { getDate, getDay } from "@/utils/getDay";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
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
  const currentDay = getDay().name
  const currentDate = getDate()

  const handleRadioChange = async (
    value: string,
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
            date: currentDate,
            status: value,
          }),
        }
      );

      const apiResponse = await response.json();
      if (apiResponse.success) {
        console.log("Attendence Updated successfully")
      } else {
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
                      <Button>Submit</Button>
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
                                handleRadioChange(value, periodItem.periodId)
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
