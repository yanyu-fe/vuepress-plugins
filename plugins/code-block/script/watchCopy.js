import { watch } from "chokidar";
import { copy, remove } from "fs-extra";
function toClientAndNode(method, file) {
    console.log(method, file);
    if (method === "copy") {
        copy(file, file.replace(/^src(\/|\\)/, "src/client/"));
    }
    else if (method === "remove") {
        remove(file.replace(/^src(\/|\\)/, "src/client/"));
    }
}
function toLib(file) {
    return file.replace(/^src(\/|\\)/, "lib/");
}
watch("src/**/*.(d.ts|vue|scss|css|less)")
    .on("change", (file) => copy(file, toLib(file)))
    .on("add", (file) => copy(file, toLib(file)))
    .on("unlink", (file) => copy(file, toLib(file)));
//# sourceMappingURL=watchCopy.js.map