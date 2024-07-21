import * as XLSX from "xlsx";

export const getExcelContent = (
  filePath: string
): { id: string; name: string; abilities: string }[] => {
  // leer el archivo *.xlsx y convertir en JSON
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  // obtener la data de la hoja de excel
  const data = XLSX.utils.sheet_to_json(sheet);

  return data as any;
};
