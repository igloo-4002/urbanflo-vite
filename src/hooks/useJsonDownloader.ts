/**
 * Custom hook to facilitate downloading JSON data as a file.
 *
 * @returns {function(string, string): void} - A function that triggers a download of a JSON string as a file.
 */
const useJsonDownloader = () => {
  /**
   * Initiates the download of a JSON string as a file.
   *
   * @param {string} jsonString - The JSON data as a string.
   * @param {string} fileName - Desired name for the downloaded file.
   */
  const downloadJson = (jsonString: string, fileName: string) => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // build link and add it to the DOM
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);

    // Download it
    link.click();

    // Remove it
    link.remove();
    URL.revokeObjectURL(url);
  };

  return downloadJson;
};

export default useJsonDownloader;
