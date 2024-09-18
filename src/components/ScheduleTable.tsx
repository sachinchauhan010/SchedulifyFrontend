import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table.jsx";

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

function ScheduleTable() {
  const [openAlert, setOpenAlert] = useState(false);

  const scheduleData = [
    {
      period: "I",
      time: "9:30AM - 11:10AM",
      subject: "Computer Network",
      course: "MCA",
      year: "II",
      batch: "P2",
      classType: "Lab",
      hallName: "Lab 101",
      attended: "Yes",
    },
    {
      period: "II",
      time: "11:20AM - 12:50PM",
      subject: "Data Structures",
      course: "MCA",
      year: "II",
      batch: "P2",
      classType: "Theory",
      hallName: "Room 202",
      attended: "No",
    },
    {
      period: "III",
      time: "1:30PM - 3:00PM",
      subject: "Database Systems",
      course: "MCA",
      year: "II",
      batch: "P2",
      classType: "Lecture",
      hallName: "Lecture Hall 3",
      attended: "Yes",
    },
    {
      period: "IV",
      time: "3:10PM - 4:40PM",
      subject: "Operating Systems",
      course: "MCA",
      year: "II",
      batch: "P2",
      classType: "Theory",
      hallName: "Room 204",
      attended: "No",
    },
  ];

  const handleRadioChange = (value:string) => {
    if (value === "no") {
      setOpenAlert(true); // Open alert dialog when "No" is selected
    }
  };

  return (
    <div className="w-full">
      <div className="text-2xl text-center w-full">Today&apos;s Schedule</div>
      <div className="text-xl font-medium p-2">Day: Monday</div>
      <Table>
        <TableCaption>Your schedule for the day</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Period</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Class Type</TableHead>
            <TableHead>Hall Name</TableHead>
            <TableHead>Want to Attend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduleData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.period}</TableCell>
              <TableCell>{item.time}</TableCell>
              <TableCell>{item.subject}</TableCell>
              <TableCell>{item.course}</TableCell>
              <TableCell>{item.year}</TableCell>
              <TableCell>{item.batch}</TableCell>
              <TableCell>{item.classType}</TableCell>
              <TableCell>{item.hallName}</TableCell>
              <TableCell>
                <RadioGroup
                  defaultValue="yes"
                  onValueChange={handleRadioChange} // Call when radio button changes
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
          ))}
        </TableBody>
      </Table>

      {/* Alert Dialog */}
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-white'>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className='text-gray-400 font-medium'>
              This action cannot be undone. You are about to skip the class.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='text-white'>
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
