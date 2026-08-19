import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "v2", "dist-v2", "assets");
const files = readdirSync(root).map((name) => ({ name, bytes: statSync(join(root, name)).size })).sort((a, b) => b.bytes - a.bytes);
const javascript = files.filter((file) => file.name.endsWith(".js"));
const total = files.reduce((sum, file) => sum + file.bytes, 0);
console.log(JSON.stringify({ assetCount: files.length, totalBytes: total, javascriptBytes: javascript.reduce((sum, file) => sum + file.bytes, 0), largestAssets: files.slice(0, 5) }, null, 2));
