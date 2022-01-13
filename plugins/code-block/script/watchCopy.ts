import { watch } from "chokidar";
import { copy, remove } from "fs-extra";

function toClientAndNode(method: string, file: string) {
  console.log(method, file);
  if (method === "copy") {
    copy(file, file.replace(/^src(\/|\\)/, "src/client/"));
  } else if (method === "remove") {
    remove(file.replace(/^src(\/|\\)/, "src/client/"));
  }
}

function toLib(file: string) {
  return file.replace(/^src(\/|\\)/, "lib/");
}

watch("src/**/*.(d.ts|vue|scss|css|less)")
  .on("change", (file: string) => copy(file, toLib(file)))
  .on("add", (file: string) => copy(file, toLib(file)))
  .on("unlink", (file: string) => copy(file, toLib(file)));
