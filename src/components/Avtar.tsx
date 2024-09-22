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
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

function Avtar() {

  const [data, setData] = useState([])
  const [ttData, setTTData] = useState<{ Day: string; data: any; }[]>([])
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
      console.log("Data before grouping:", data);

      const groupedByDays = data.reduce(
        (result: { [key: number | string]: any }, current: any) => {
          const { Day, ...rest }: any = current;

          if (!result[Day]) {
            result[Day] = [];
          }
          result[Day].push(rest);

          return result;
        },
        {}
      );

      const ttDataArray = Object.keys(groupedByDays).map((day) => ({
        Day: day,
        data: groupedByDays[day],
      }));

      setTTData(ttDataArray);
    }
  }, [data]);

  // Handle File Upload and read data
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
        setData(parsedData); // Set the parsed Excel data
      };
    }
  };

  // Handle File Submission to the API
  const handleFileSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PRODUCTION_URI}/api/faculty/settimetable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ttData),
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

  // Fetch Username when component mounts
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
            <DialogDescription>
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
