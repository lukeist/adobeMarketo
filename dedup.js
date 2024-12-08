const fs = require("fs");
const path = require("path");

const dedup = (inputPath) => {
  const rawData = fs.readFileSync(inputPath, "utf8");
  const { leads } = JSON.parse(rawData);

  const idMap = new Map();
  const emailMap = new Map();
  const changes = [];

  const resolveDuplicates = (existing, current) => {
    if (!existing) return current;

    const existingDate = new Date(existing.entryDate).getTime();
    const currentDate = new Date(current.entryDate).getTime();
    if (currentDate > existingDate || currentDate === existingDate) {
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

  leads.forEach((lead) => {
    idMap.set(lead._id, resolveDuplicates(idMap.get(lead._id), lead));
  });

  idMap.forEach((lead) => {
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

  fs.writeFileSync(
    deduplicatedLeadsPath,
    JSON.stringify({ leads: dedupedLeads }, null, 2)
  );
  fs.writeFileSync(changeLogPath, JSON.stringify(changes, null, 2));

  console.log(`Deduplicated leads saved to: ${deduplicatedLeadsPath}`);
  console.log(`Change log saved to: ${changeLogPath}`);
};

const inputFile = process.argv[2];
if (!inputFile) {
  console.error(
    "Please provide the path to the leads.json file as an argument."
  );
  process.exit(1);
}

dedup(inputFile);
