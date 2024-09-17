import { useState, ChangeEvent } from "react";
import * as XLSX from "xlsx";

interface DataRow {
  [key: string]: string | number;
}

function FileUpload() {
  const [data, setData] = useState<DataRow[]>([]);

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
        const parsedData: DataRow[] = XLSX.utils.sheet_to_json(sheet);
        setData(parsedData);
      };
      console.log(data, "Faculty Data");
    }
  };

  return (
    <div>
      <div className="w-fit flex flex-col justify-center items-center text-center border-[2px] rounded">
        <div className="text-lg font-semibold py-2">Upload/Update Your Time Table</div>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="text-center px-4"
        />
       
        {data.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, index) => (
                    <td key={index}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <br /><br />
      </div>
    </div>
  );
}

export default FileUpload;
