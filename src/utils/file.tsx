export const extractFileName = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  let fileURL = queryParameters.get("file");
  fileURL = fileURL ? fileURL : "";
  const { isValid, extension } = validateFileName(fileURL);
  if (isValid) {
    const fileTitle = fileURL.split("/").pop();
    return {
      extension: extension,
      fileURL: fileURL,
      fileTitle: fileTitle ? fileTitle : "",
    };
  }
  return { extension: null, fileURL: "", fileTitle: "" };
};

const validateFileName = (fileName: string) => {
  const pattern =
    /^https:\/\/gh\.hoa\.moe\/github\.com\/HITSZ-OpenAuto\/.*\.(docx|pdf|png|pptx|jpg|jpeg|xlsx|txt|md)$/;

  const fileNameRegex = pattern; // Using your defined pattern

  const isValid = fileNameRegex.test(fileName);
  console.log("Is valid:", isValid);

  // Extract the file extension
  let extension = null;
  if (isValid) {
    const extensionMatch = fileName.match(/\.([^.]+)$/);
    extension = extensionMatch ? extensionMatch[1] : null;
    console.log("File extension:", extension);
  }

  return {
    isValid: isValid,
    extension: extension,
  };
};
