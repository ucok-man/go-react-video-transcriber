import LoadingRocket from "./components/loading-rocket";
import Preview from "./components/preview";
import TranscribeContent from "./components/transcrib-content";
import TranscribeButton from "./components/transcribe-btn";
import { useTranscribe } from "./context/trasncribe-provider";

export default function App() {
  const { isTranscribing } = useTranscribe();

  return (
    <main className="min-h-screen bg-slate-900 text-slate-300">
      <div className="flex items-center justify-center p-8">
        <h1 className="mb-4 text-7xl font-bold uppercase max-sm:text-5xl">
          Video Transcriber
        </h1>
      </div>
      <div className="grid size-full gap-8 p-4 lg:grid-cols-2">
        <div className=" flex flex-col gap-8">
          <Preview />
          <TranscribeButton />
        </div>
        <div className="min-h-[500px]">
          <TranscribeContent />
        </div>
      </div>

      {isTranscribing && (
        <div className="">
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 flex size-full flex-col items-center justify-center">
            <LoadingRocket />
          </div>
        </div>
      )}
    </main>
  );
}
