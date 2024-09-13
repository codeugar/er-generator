interface DownloadButtonProps {
    svgContent: string;
    fileName: string;
  }
  
  export default function DownloadButton({ svgContent, fileName }: DownloadButtonProps) {
    const downloadSVG = () => {
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
  
    return (
      <button
        onClick={downloadSVG}
        className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Download Diagram
      </button>
    );
  }