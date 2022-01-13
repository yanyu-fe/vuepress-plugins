import { existsSync, readFileSync } from "fs";

export const resolveSourceCode = (path: string) => {
  if (existsSync(path)) {
    return readFileSync(path, { encoding: "utf-8" });
  } else {
    console.warn("not exists path:" + path);
  }
};
