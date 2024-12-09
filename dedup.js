const fs = require("fs");
const path = require("path");

const dedup = (inputPath) => {
  let rawData;
  try {
    rawData = fs.readFileSync(inputPath, "utf8");
  } catch (error) {
    console.error("Error reading the file:", error.message);
    process.exit(1);
  }

  let parsedData;
  try {
    parsedData = JSON.parse(rawData);
  } catch (error) {
    console.error("Invalid JSON format:", error.message);
    process.exit(1);
  }

  if (!Array.isArray(parsedData?.leads)) {
    console.error("The JSON file must contain a 'leads' array.");
    process.exit(1);
  }

  const skippedRecords = [];
  const validLeads = parsedData.leads.filter((lead) => {
    if (
      !lead._id ||
      !lead.email ||
      !lead.entryDate ||
      isNaN(new Date(lead.entryDate).getTime())
    ) {
      skippedRecords.push(lead);
      return false;
    }
    return true;
  });

  const idMap = new Map();
  const emailMap = new Map();
  const changes = [];

  const resolveDuplicates = (existing, current) => {
    if (!existing) return current;

    const existingDate = new Date(existing.entryDate).getTime();
    const currentDate = new Date(current.entryDate).getTime();
    if (currentDate >= existingDate) {
      logChange(existing, current);
      return current;
    }
    return existing;
  };

  const logChange = (oldRecord, updatedRecord) => {
    const fieldChanges = Object.entries(updatedRecord).reduce(
      (acc, [key, value]) => {
        if (oldRecord[key] !== value) {
          acc[key] = { from: oldRecord[key], to: value };
        }
        return acc;
      },
      {}
    );
    changes.push({ oldRecord, updatedRecord, fieldChanges });
  };

  validLeads.forEach((lead) => {
    idMap.set(lead._id, resolveDuplicates(idMap.get(lead._id), lead));
  });

  idMap.forEach((lead) => {
    lead.email = lead.email.toLowerCase();
    emailMap.set(lead.email, resolveDuplicates(emailMap.get(lead.email), lead));
  });

  const dedupedLeads = Array.from(emailMap.values());
  const outputPath = path.join(path.dirname(inputPath), "output");

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  const deduplicatedLeadsPath = path.join(
    outputPath,
    "deduplicated_leads.json"
  );
  const changeLogPath = path.join(outputPath, "change_log.json");
  const skippedRecordsPath = path.join(outputPath, "skipped_records.json");

  fs.writeFileSync(
    deduplicatedLeadsPath,
    JSON.stringify({ leads: dedupedLeads }, null, 2)
  );
  fs.writeFileSync(changeLogPath, JSON.stringify(changes, null, 2));
  if (skippedRecords.length)
    fs.writeFileSync(
      skippedRecordsPath,
      JSON.stringify({ skippedRecords }, null, 2)
    );

  console.log(`Deduplicated leads saved to: ${deduplicatedLeadsPath}`);
  console.log(`Change log saved to: ${changeLogPath}`);
  if (skippedRecords.length)
    console.log(`Skipped records saved to: ${skippedRecordsPath}`);
};

const inputFile = process.argv[2];
if (!inputFile) {
  console.error(
    "Please provide the path to the leads.json file as an argument."
  );
  process.exit(1);
}

dedup(inputFile);
