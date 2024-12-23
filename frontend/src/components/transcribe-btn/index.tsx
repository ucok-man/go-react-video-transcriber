// type Props = {};

import { useTranscribe } from "@/context/trasncribe-provider";

export default function TranscribeButton() {
  const { isTranscribing, transcribFn } = useTranscribe();

  return (
    <button
      type="button"
      onClick={() => transcribFn()}
      className="rounded-lg bg-gray-300 p-2 px-4 font-semibold uppercase text-gray-900 hover:opacity-90"
      disabled={isTranscribing}
    >
      Transcribe
    </button>
  );
}
