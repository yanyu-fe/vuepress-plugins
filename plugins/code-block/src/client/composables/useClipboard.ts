import { Ref, ref, ComputedRef, isRef } from "vue";

export const useClipboard = (delay = 3000) => {
  const copied = ref<boolean>(false);
  const copy = (text: string | Ref<string> | ComputedRef<string>) => {
    let copyText;
    if (isRef(text)) {
      copyText = text.value;
    } else {
      copyText = text;
    }
    clipboardCopy(copyText).then(() => {
      copied.value = true;
      const timer = setTimeout(() => {
        copied.value = false;
        clearTimeout(timer);
      }, delay);
    });
  };
  return {
    copied,
    copy,
  };
};

function makeError() {
  return new DOMException("The request is not allowed", "NotAllowedError");
}

async function copyClipboardApi(text: string) {
  // Use the Async Clipboard API when available. Requires a secure browsing
  // context (i.e. HTTPS)
  if (!navigator.clipboard) {
    throw makeError();
  }
  return navigator.clipboard.writeText(text);
}

async function copyExecCommand(text: string) {
  // Put the text to copy into a <span>
  const span = document.createElement("span");
  span.textContent = text;

  // Preserve consecutive spaces and newlines
  span.style.whiteSpace = "pre";
  span.style.webkitUserSelect = "auto";
  span.style.userSelect = "all";

  // Add the <span> to the page
  document.body.appendChild(span);

  // Make a selection object representing the range of text selected by the user
  const selection: any = window.getSelection();
  const range = window.document.createRange();
  selection.removeAllRanges();
  range.selectNode(span);
  selection.addRange(range);

  // Copy text to the clipboard
  let success = false;
  try {
    success = window.document.execCommand("copy");
  } finally {
    // Cleanup
    selection.removeAllRanges();
    window.document.body.removeChild(span);
  }

  if (!success) throw makeError();
}

async function clipboardCopy(text: string) {
  try {
    await copyClipboardApi(text);
  } catch (err) {
    // ...Otherwise, use document.execCommand() fallback
    try {
      await copyExecCommand(text);
    } catch (err2) {
      throw err2 || err || makeError();
    }
  }
}
