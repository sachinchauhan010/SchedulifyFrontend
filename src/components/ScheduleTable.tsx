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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";


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


type Schedule = {
  [day: string]: ScheduleItem[];
};

function ScheduleTable() {
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<Schedule>({});

  const handleRadioChange = (value: string) => {
    if (value === "no") {
      setOpenAlert(true);
    }
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
        return;
      }
      setSchedule(apiresponse?.data[0] || {});
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  }

  useEffect(() => {
    getSchedule();
  }, []);

  return (
    <div className="w-full">
      <div className="text-2xl text-center w-full">Today's Schedule</div>
      {Object.keys(schedule).map((day) => (
        <div key={day}>
          <div className="text-xl font-medium p-2">Day: {day}</div>
          <Table>
            <TableCaption>Your schedule for {day}</TableCaption>
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
              {Array.isArray(schedule[day]) && schedule[day].length > 0 ? (
                schedule[day].map((item, index) => (
                  <TableRow key={index}>
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
                        onValueChange={handleRadioChange}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id={`yes-${index}`} />
                          <Label htmlFor={`yes-${index}`}>Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id={`no-${index}`} />
                          <Label htmlFor={`no-${index}`}>No</Label>
                        </div>
                      </RadioGroup>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    No schedule available for {day}.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ))}

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400 font-medium">
              This action cannot be undone. You are about to skip the class.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="text-white">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setOpenAlert(false)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ScheduleTable;
