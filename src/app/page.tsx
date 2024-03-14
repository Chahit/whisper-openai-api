"use client";
import { useState } from "react";

export default function Home() {
  const [theFile, setTheFile] = useState<File | null>(null); // this state is used to check if a file is entered or not
  const [isLoading, setIsLoading] = useState(false); // we have use this state to check if the file is submitted then create a async function 
  const [response, setResponse] = useState(""); // we created this as we wanted the response back 

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]; // ?. is known as optional chaining operator and is used to access the object in an array here we are checking for the first object and we have created an event for that 
    if (!file) return;

    setTheFile(file);
  };

  const callGetTranscription = async () => {
    setIsLoading(true);

    if (!theFile) {
      // Handle the case when no file is selected
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.set("file", theFile); // The selected file (theFile) is appended to this form data with the key "file"

    try {
      const response = await fetch("/api", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Handle the success response
        console.log("File uploaded successfully");
      } else {
        // Handle the error response
        console.error("Failed to upload file");
      }

      const data = await response.json();

      setResponse(data.output.text);
    } catch (error) {
      // Handle any errors
      console.error("An error occurred while uploading the file", error);
    }

    setTheFile(null); // finally we set them here as the file was successfully uploaded to the server without any errors
    setIsLoading(false);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-24 py-5">
      <h1 className="text-5xl font-sans">Whisperer</h1>

      <div className="flex  h-[35rem] w-[40rem] flex-col items-center bg-gray-600 rounded-xl">
        <div className=" h-full flex flex-col gap-2 overflow-y-auto py-8 px-3 w-full">
          <input type="file" accept=".wav, .mp3" onChange={handleFileChange} />

          <div className="w-[90%] h-max border-2 break-words">
            {isLoading ? "Loading..." : response ? response : ""}
          </div>
        </div>
        <div className="relative  w-[80%] bottom-4 flex justify-center">
          <button
            onClick={callGetTranscription}
            className="w-max bg-blue-500 px-4 py-2 rounded-sm "
          >
            Upload
          </button>
        </div>
      </div>
    </main>
  );
}
