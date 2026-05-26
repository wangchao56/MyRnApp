const readText = async () => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
    return navigator.clipboard.readText();
  }
  return '';
};

const writeText = async text => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  }
};

const Clipboard = {
  getString: readText,
  setString: writeText,
  async hasString() {
    try {
      const text = await readText();
      return text.length > 0;
    } catch {
      return false;
    }
  },
  getStrings: async () => [],
  setStrings: () => {},
  getImagePNG: async () => '',
  getImageJPG: async () => '',
  getImage: async () => '',
  setImage: () => {},
  hasImage: async () => false,
  hasURL: async () => false,
  hasNumber: async () => false,
  hasWebURL: async () => false,
  addListener: () => ({remove: () => {}}),
  removeAllListeners: () => {},
};

export default Clipboard;
