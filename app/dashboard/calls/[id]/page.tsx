import { createClient } from "@/utils/supabase/server";

export default async function CallDetail({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: call } = await supabase
    .from("calls")
    .select("*")
    .eq("id", params.id)
    .single();
  const { data: transcript } = await supabase
    .from("transcripts")
    .select("*")
    .eq("call_id", params.id)
    .single();

  if (!call) return <p>Call not found.</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Call Detail</h2>
      <div className="bg-white p-4 rounded shadow mb-4">
        <p>
          <strong>Caller:</strong> {call.caller}
        </p>
        <p>
          <strong>Started:</strong> {new Date(call.start_time).toLocaleString()}
        </p>
        <p>
          <strong>Ended:</strong>{" "}
          {call.end_time ? new Date(call.end_time).toLocaleString() : "Live"}
        </p>
        <p>
          <strong>Duration:</strong> {call.minutes ?? "–"} min
        </p>
      </div>

      {transcript ? (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Transcript</h3>
          <pre className="text-sm whitespace-pre-wrap text-gray-700 mb-3">
            {transcript.content}
          </pre>
          <h3 className="font-semibold mb-2">Summary</h3>
          <p className="text-gray-700">{transcript.summary}</p>
        </div>
      ) : (
        <p>No transcript yet.</p>
      )}
    </div>
  );
}
