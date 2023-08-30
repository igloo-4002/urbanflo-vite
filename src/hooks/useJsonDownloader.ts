const useJsonDownloader = () => {
  const downloadJson = (jsonString: string, fileName: string) => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // build link and add it to the DOM
    link.href = url;
    link.download = 'data.json';
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
