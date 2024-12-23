/* eslint-disable react-refresh/only-export-components */
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  useTransition,
} from "react";

// Define the context type
interface TranscribeContextType {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  transcribedContent: string | null;
  transcribFn: () => void;
  isTranscribing: boolean;
}

// Create the context
export const TranscribeContext = createContext<
  TranscribeContextType | undefined
>(undefined);

export default function TranscribeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [transcribedContent, setTranscribedContent] = useState<string | null>(
    null
  );
  const [isTranscribing, startTransition] = useTransition();
  const { toast } = useToast();

  const transcribFn = useCallback(() => {
    if (!file) {
      toast({
        title: "Unprocessable Entity",
        description: "No video file has been selected",
      });
      return;
    }

    const formdata = new FormData();
    formdata.append("file", file);

    startTransition(() => {
      (async () => {
        try {
          const response = await axios.post(
            import.meta.env.BACKEND_URL,
            formdata,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.status !== 200) {
            console.log("!OK Response: ", response.data.error);
            toast({
              title: "Internal Server Error",
              description:
                "Sorry we have problem in our server. Try again later",
            });
            return;
          }

          startTransition(() => {
            setTranscribedContent(response.data.transcrib);
          });
        } catch (error) {
          console.log("Error transcribing:", error);
          toast({
            title: "Internal Server Error",
            description: "Sorry we have problem in our server. Try again later",
          });
        }
      })();
    });
  }, [file, toast]);

  return (
    <TranscribeContext.Provider
      value={{ setFile, transcribedContent, isTranscribing, transcribFn }}
    >
      {children}
    </TranscribeContext.Provider>
  );
}

// Custom hook to use the search context
export const useTranscribe = () => {
  const context = useContext(TranscribeContext);
  if (context === undefined) {
    throw new Error("useTranscribe must be used within a TranscribeProvider");
  }
  return context;
};
