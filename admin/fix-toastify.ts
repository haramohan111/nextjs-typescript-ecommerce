import fs from "fs";
import path from "path";

const filePath = path.resolve(
  __dirname,
  "node_modules/react-toastify/dist/ReactToastify.css"
);

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading ReactToastify.css:", err);
    return;
  }

  const updatedData = data.replace(/\/\*# sourceMappingURL=.*\*\//, "");

  fs.writeFile(filePath, updatedData, "utf8", (err) => {
    if (err) {
      console.error("Error writing ReactToastify.css:", err);
    } else {
      console.log("Source map reference removed successfully.");
    }
  });
});
