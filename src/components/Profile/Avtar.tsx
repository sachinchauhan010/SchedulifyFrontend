import { useState, ChangeEvent, useEffect } from "react";
import * as XLSX from "xlsx";

import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

type ttSchedule = { day: string; periods: { period: any; time: any; subject: any; course: any; semester: any; batch: any; classType: any; hallName: any; periodId: string; classesAttended: any; attendanceRecords: never[]; }[]; }[]

function Avtar() {

  const [data, setData] = useState([])
  const [ttData, setTTData] = useState<ttSchedule>([])
  const [name, setName] = useState(null)

  const { authState, dispatch: dispatchAuthState } = useAuth()

  async function handleLogout() {
    const response = await fetch(`${import.meta.env.VITE_PRODUCTION_URI}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    const data: any = await response.json();
    if (data?.success) {
      dispatchAuthState({ type: "LOGOUT", })
      console.log('Logout successful');
    } else {
      console.error('Logout failed:', data?.message);
    }
  }

  useEffect(() => {
    if (data.length > 0) {
      const groupedByDays = data.reduce(
        (result: { [key: string]: any[] }, current: any) => {
          const { Day, ...rest } = current;

          if (!result[Day]) {
            result[Day] = [];
          }
          result[Day].push(rest);

          return result;
        },
        {}
      );
      console.log(groupedByDays, "&&&&&&&&&&")

      const ttDataArray = Object.keys(groupedByDays).map((day) => ({
        day: day,
        periods: groupedByDays[day].map((periodItem: any) => ({
          period: periodItem.Period,
          time: periodItem.Time,
          subject: periodItem.Subject,
          course: periodItem.Course,
          semester: periodItem.Semester,
          batch: periodItem.Batch,
          classType: periodItem.ClassType,
          hallName: periodItem.HallName,
          periodId: `${day}-${periodItem.Period}`,
          classesAttended: periodItem.ClassesAttended || 0,
          attendanceRecords: [],
        })),
      }));

      console.log(ttDataArray);

      setTTData(ttDataArray);
    }
  }, [data]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (event) => {
        const binaryStr = event.target?.result as string;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData: any = XLSX.utils.sheet_to_json(sheet);
        setData(parsedData);
      };
    }
  };


  const handleFileSubmit = async () => {
    try {
      const timetableId = "00001";

      const payload = {
        timetableId,
        schedule: ttData,
      };

      const response = await fetch(`${import.meta.env.VITE_PRODUCTION_URI}/api/faculty/settimetable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      const apiresponse = await response.json();

      if (!apiresponse.success) {
        toast({
          title: "Failed to upload Time Table",
        });
        return;
      }

      toast({
        title: "Time Table uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading timetable:", error);
      toast({
        title: "Failed to upload Time Table",
      });
    }
  };


  async function fetchName() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PRODUCTION_URI}/api/faculty/getusername`,
        {
          credentials: "include",
        }
      );
      const apiResponse = await response.json();

      if (apiResponse.success) {
        setName(apiResponse.userData);
      }
    } catch (error) {
      console.log("Error fetching user name:", error);
    }
  }

  useEffect(() => {
    fetchName();
  }, [authState.isLoggedIn])

  return (
    <>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger className="border-[1px] rounded-md px-4 py-1">
            {name}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>
              <DialogTrigger>Upload TimeTable</DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem><Link to={"/schedule"}>schedule</Link></DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload the excel file here</DialogTitle>
            <DialogDescription className="flex justify-between items-end gap-10 py-2">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Upload Time Table</Label>
                <Input
                  id="picture"
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                />
              </div>
              <Button onClick={handleFileSubmit}>Upload</Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Avtar;
