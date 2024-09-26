import { useEffect, useState } from "react";
import { getDay, getDayIdByName, getDate } from "@/utils/getDay";
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
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "./ui/alert-dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";

type ScheduleItem = {
  Period: string;
  Time: string;
  Subject: string;
  Course: string;
  Semester: string;
  Batch: string;
  ClassType: string;
  HallName: string;
};

type DaySchedule = {
  Day: string;
  data: ScheduleItem[];
};

type ClassSchedule = Record<string, string>;

function ScheduleTable() {
  // const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [, setIsClassSchedule] = useState<ClassSchedule[]>([])
  const [, setSelectOPtion] = useState<string>('')

  const { authState } = useAuth();

  useEffect(() => {
    if (authState?.isLoggedIn) {
      getSchedule();
    }
  }, [authState?.isLoggedIn]);


  const handleRadioChange = (value: string, Day: String, Period: String) => {
    const classId = `${getDate()}-${Day}-${Period}`
    setSelectOPtion(value);
    setIsClassSchedule((prevSchedule) => [
      ...prevSchedule,
      { [classId]: value || "yes" }
    ]);
  };


  async function getSchedule() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PRODUCTION_URI}/api/faculty/getschedule`,
        {
          credentials: "include",
        }
      );
      const apiresponse = await response.json();
      if (!apiresponse.success) {
        console.log("Failed to fetch the data");
        setSchedule([]);
        return;
      }
      setSchedule(apiresponse.data[0] || []);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  }

  return (
    <div className="w-full">
      <div className="text-2xl text-center w-full">Track My Class</div>
      {schedule.map((daySchedule, index) => (
        <div key={index}>
          <Accordion type="single" collapsible defaultValue={"item-" + getDay().id}>
            <AccordionItem value={"item-" + getDayIdByName(daySchedule.Day)}>
              <AccordionTrigger>{daySchedule.Day}</AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableCaption>Your schedule for {daySchedule.Day}</TableCaption>
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
                    {daySchedule.data && daySchedule.data.length > 0 ? (
                      daySchedule.data.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.Period}</TableCell>
                          <TableCell>{item.Time}</TableCell>
                          <TableCell>{item.Subject}</TableCell>
                          <TableCell>{item.Course}</TableCell>
                          <TableCell>{item.Semester}</TableCell>
                          <TableCell>{item.Batch}</TableCell>
                          <TableCell>{item.ClassType}</TableCell>
                          <TableCell>{item.HallName}</TableCell>
                          <TableCell>
                            <RadioGroup
                              defaultValue="yes"
                              onValueChange={(value) => handleRadioChange(value, daySchedule.Day, item?.Period)}
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
                          No schedule available for {daySchedule.Day}.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <div className="flex justify-end items-center">
                  {/* <Button onClick={SubmitResponse}>Submit Schedule</Button> */}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}

      {/* <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. You are about to skip the class.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={}>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  );
}

export default ScheduleTable;
