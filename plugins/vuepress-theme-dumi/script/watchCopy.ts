import { watch } from "chokidar";
import { copy } from "fs-extra";

function toLib(file: string) {
  return file.replace(/^src(\/|\\)/, "lib/");
}

watch("src/**/*.(d.ts|vue|scss|css|less)")
  .on("change", (file: string) => copy(file, toLib(file)))
  .on("add", (file: string) => copy(file, toLib(file)))
  .on("unlink", (file: string) => copy(file, toLib(file)));
