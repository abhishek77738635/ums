import * as xlsx from 'xlsx'; // Use this for ES6

export const convertCsvToExcel = (csvData, fileName) => {
    try {
        // Parse CSV
        const parseCSV = (csvString) => {
            const [headers, ...rows] = csvString
                .split("\n")
                .map(row => row.split(",").map(cell => cell.replace(/"/g, "")));

            return rows.map(row => Object.fromEntries(row.map((cell, i) => [headers[i], cell])));
        };

        const jsonData = parseCSV(csvData);

        // Ensure xlsx is working
        if (!xlsx || !xlsx.utils) {
            throw new Error("xlsx module is not loaded properly");
        }

        // Create workbook
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(jsonData);
        xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Save file
        xlsx.writeFile(workbook, fileName);
        console.log(`✅ Excel file '${fileName}' created successfully!`);
    } catch (error) {
        console.error("❌ Error converting CSV to Excel:", error);
    }
};

