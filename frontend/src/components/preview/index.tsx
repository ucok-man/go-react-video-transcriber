import { useTranscribe } from "@/context/trasncribe-provider";
import { useToast } from "@/hooks/use-toast";
import { ChangeEvent, useState } from "react";
import { cn, validateFileType } from "../../lib/utils";
import { Icons } from "../icons";

export default function Preview() {
  const { toast } = useToast();
  const { setFile } = useTranscribe();
  const [input, setInput] = useState<{ source: string; name: string } | null>(
    null
  );
  const [dragActive, setDragActive] = useState<boolean>(false);

  // handle drag events
  const handleDrag = (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is selected with click
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target?.files?.[0];
    if (!file) {
      toast({
        title: "Invalid file input",
        description: "No file has selected. Please select a video file",
      });
      return;
    }

    const valid = validateFileType(file);
    if (!valid) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid file type.",
      });
      return;
    }

    try {
      const objectUrl = URL.createObjectURL(file);
      setInput({
        name: file.name,
        source: objectUrl,
      });
      setFile(file);
    } catch (error) {
      console.error("Error creating object URL:", error);
      toast({
        title: "Error",
        description: "Could not process the dropped file.",
      });
    }
  };

  // triggers when file is dropped
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (!file) {
      toast({
        title: "Invalid file input",
        description: "No file has selected. Please select a video file",
      });
      return;
    }

    if (!validateFileType(file)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid file type.",
      });
      return;
    }

    try {
      const objectUrl = URL.createObjectURL(file);
      setInput({
        name: file.name,
        source: objectUrl,
      });
      setFile(file);
    } catch (error) {
      console.error("Error creating object URL:", error);
      toast({
        title: "Error",
        description: "Could not process the dropped file.",
      });
    }
  };

  return (
    <form className="flex size-full items-center justify-start">
      <label
        htmlFor="dropzone-file"
        className={cn(
          "group relative size-full flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg border-gray-600 transition",
          { "border-slate-400 bg-slate-800": dragActive },
          {
            "h-fit aspect-auto items-start justify-start": input,
          }
        )}
      >
        <div
          className={cn(
            "relative size-full flex flex-col items-center justify-center",
            { "items-start": input }
          )}
        >
          {!input && (
            <>
              <div
                className="absolute inset-0 cursor-pointer"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              />

              <Icons.cloud className="mb-3 size-10 text-gray-400" />

              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>

              <input
                onChange={handleChange}
                accept="video/mp4, video/mpeg, video/ogg, video/webm, video/quicktime"
                id="dropzone-file"
                type="file"
                className="hidden"
              />
            </>
          )}

          {input && (
            <>
              <video className="w-full" controls src={input.source} />
              <div className="flex w-full items-center justify-between gap-x-4 p-4">
                <h2 className="font-semibold text-gray-400">
                  File :{" "}
                  <span className="font-medium italic">{input.name}</span>
                </h2>
                <label
                  htmlFor="dropzone-file-input-present"
                  className="relative flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-300 p-2 px-4 text-sm tracking-tight text-gray-900 hover:opacity-90"
                >
                  <span className="font-semibold">Change Video</span>
                  <Icons.cloud className="size-6" />
                  <input
                    onChange={handleChange}
                    accept="video/mp4, video/mpeg, video/ogg, video/webm, video/quicktime"
                    id="dropzone-file-input-present"
                    type="file"
                    className="absolute inset-0 hidden"
                  />
                </label>
              </div>
            </>
          )}
        </div>
      </label>
    </form>
  );
}
