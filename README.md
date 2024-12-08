# Lead Deduplication Script

This script removes duplicate leads in a JSON file based on two criteria:

1. Unique lead IDs (`_id`).
2. Unique emails (`email`).

It keeps the latest version based on `entryDate` and creates two output files:

- `deduplicated_leads.json`: The deduplicated leads.
- `change_log.json`: A log of changes made.

## How It Works

1. Reads a JSON file with lead data.
2. Removes duplicates by `_id` and `email`.
3. Logs changes between original and updated records.
4. Saves the deduplicated leads and the change log in an `output/` folder.

## How to Run

### Option 1: Run with Node.js

1. Clone the repository or download the script.
2. Open the terminal and navigate to the script directory.
3. Run the script:
   ```bash
   node dedup.js <path-to-leads.json>
   ```
4. The output files will be saved in an `output/` folder inside the script directory for simplicity.

   **Example:**

   ```bash
   node dedup.js leads.json
   ```

### Option 2: Run with Precompiled Binary

If you don’t have Node.js installed, you can use the precompiled binary for your operating system:

#### For macOS:

1. Open the terminal.
2. Navigate to the directory containing the `dedup` binary.
3. Make the binary executable:
   ```bash
   chmod +x ./bin/macos/dedup
   ```
4. Run the binary with your JSON file:

   ```bash
   ./bin/macos/dedup <path-to-leads.json>
   ```

   **Example:**

   ```bash
   chmod +x ./bin/macos/dedup
   ./bin/macos/dedup leads.json
   ```

#### For Linux:

1. Open the terminal.
2. Navigate to the directory containing the `dedup` binary.
3. Make the binary executable:
   ```bash
   chmod +x ./bin/linux/dedup
   ```
4. Run the binary with your JSON file:

   ```bash
   ./bin/linux/dedup <path-to-leads.json>
   ```

   **Example:**

   ```bash
   chmod +x ./bin/linux/dedup
   ./bin/linux/dedup leads.json
   ```

#### For Windows:

1. Open Command Prompt or PowerShell.
2. Navigate to the directory containing the `dedup.exe` binary.
3. Run the binary with your JSON file:

   ```bash
   ./bin/win/dedup.exe <path-to-leads.json>
   ```

   **Example:**

   ```bash
   ./bin/win/dedup.exe leads.json
   ```

### Output Files

In all options, the following files will be created inside the `output/` folder:

- `deduplicated_leads.json`: The deduplicated leads.
- `change_log.json`: The change log.

## Requirements

- For Node.js option: Node.js 12.x or higher.
- The input file should have a `leads` array with objects that include `_id`, `email`, and `entryDate`.

## License

MIT License.
