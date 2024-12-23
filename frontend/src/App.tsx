import Preview from "./components/preview";
import TranscribeContent from "./components/transcrib-content";
import TranscribeButton from "./components/transcribe-btn";

export default function App() {
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
    </main>
  );
}
