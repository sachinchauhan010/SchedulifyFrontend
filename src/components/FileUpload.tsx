import { useState, ChangeEvent, useEffect } from "react";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";

function FileUpload() {
  const [data, setData] = useState<any>([])
  const [ttData, setTTData] = useState<any>({})

  useEffect(() => {
    if (data.length > 0) {
      const groupedByDays = data.reduce((result: { [key: number | string]: any }, current: any) => {
        const { Day, ...rest }: any = current;

        if (!result[Day]) {
          result[Day] = [];
        }
        result[Day].push(rest);

        return result;
      }, {});
      setTTData(groupedByDays);
    }
  }, [data]);

  const handleFileSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PRODUCTION_URI}/api/faculty/settimetable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ttData),
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
        setData(parsedData);
      };
    }
  };

  return (
    <div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Upload Time Table</Label>
        <Input id="picture" type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      </div>

      <Button onClick={handleFileSubmit}>Upload</Button>

      <br /><br />
    </div>
  );
}

export default FileUpload;