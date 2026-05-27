export async function setClipboard(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const Clipboard = require('@react-native-clipboard/clipboard').default as {
    setString: (value: string) => void;
  };
  await Clipboard.setString(text);
}

export async function getClipboard(): Promise<string> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
    return navigator.clipboard.readText();
  }
  const Clipboard = require('@react-native-clipboard/clipboard').default as {
    getString: () => string;
  };
  return Clipboard.getString();
}
