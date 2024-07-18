import * as XLSX from "xlsx";

export const getExcelContent = (
  filePath: string
): { id: string; name: string; abilities: string }[] => {
  // read the *.xlsx file and parse it to JSON
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  // get the data from the sheet
  const data = XLSX.utils.sheet_to_json(sheet);

  return data as any;
};
