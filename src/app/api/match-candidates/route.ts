import { createClient } from "../../../../supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Get job details
    const { data: job, error: jobError } = await supabase
      .from("job_postings")
      .select("*")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // In a real implementation, this would use an AI algorithm to match candidates
    // For now, we'll simulate by finding users who aren't the job creator
    const { data: potentialCandidates, error: candidatesError } = await supabase
      .from("users")
      .select("*")
      .neq("id", job.company_id)
      .limit(5);

    if (candidatesError) {
      return NextResponse.json(
        { error: "Failed to find candidates" },
        { status: 500 },
      );
    }

    // Create matches with simulated scores
    const candidateMatches = potentialCandidates.map((candidate) => ({
      job_id: jobId,
      candidate_id: candidate.id,
      match_score: Math.floor(Math.random() * 40) + 60, // Random score between 60-99
      status: "matched",
    }));

    // Insert matches into job_candidates table
    if (candidateMatches.length > 0) {
      const { error: insertError } = await supabase
        .from("job_candidates")
        .upsert(candidateMatches, { onConflict: "job_id,candidate_id" });

      if (insertError) {
        return NextResponse.json(
          { error: "Failed to create matches" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      matchedCandidates: candidateMatches.length,
    });
  } catch (error) {
    console.error("Error in match-candidates API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
