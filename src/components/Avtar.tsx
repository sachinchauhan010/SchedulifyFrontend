import { useState, ChangeEvent, useEffect } from "react";
import * as XLSX from "xlsx";
import { toast } from "@/hooks/use-toast";

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

function Avtar() {
  const [data, setData] = useState<any>([]);
  const [ttData, setTTData] = useState<any>({});
  const [name, setName] = useState<string | null>(null);

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

      console.log("Grouped by Days:", groupedByDays);

      setTTData(groupedByDays);
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
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        setData(parsedData); // Set the parsed Excel data
      };
    }
  };

  // Handle File Submission to the API
  const handleFileSubmit = async () => {
    // Check if ttData is ready
    if (!ttData || Object.keys(ttData).length === 0) {
      toast({
        title: "Time Table is empty. Please upload the data before submitting.",
      });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_PRODUCTION_URI}/api/faculty/settimetable`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ttData), // Send ttData to the backend
          credentials: "include",
        }
      );

      const apiResponse = await response.json();

      if (!apiResponse.success) {
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
  }, []);

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
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
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
