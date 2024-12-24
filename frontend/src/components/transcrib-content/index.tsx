import { useTranscribe } from "@/context/trasncribe-provider";

export default function TranscribeContent() {
  const { transcribedContent } = useTranscribe();

  return (
    <div className="size-full max-h-[700px] overflow-scroll rounded-lg border-2 border-dashed border-gray-600 p-4 px-6">
      <h1 className="mb-6 py-2 text-4xl font-semibold uppercase text-gray-400 underline underline-offset-8">
        Transcibed Text
      </h1>
      <div className="text-balance text-lg">{transcribedContent}</div>
    </div>
  );
}
