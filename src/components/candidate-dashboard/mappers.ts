"use client";

// Fonction pour mapper les données Supabase aux props de composants
export function mapSupabaseDataToComponentProps({ user, profile, experiences, documents, jobMatches }: any) {
  if (!profile) return null;

  return {
    candidate: {
      id: profile.id,
      name: profile.full_name,
      avatarUrl: profile.avatar_url,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      bio: profile.bio,
      isAvailable: profile.is_available,
      rating: profile.rating,
      skills: profile.skills || [],
      availability: {
        startDate: profile.availability_start ? new Date(profile.availability_start) : null,
        endDate: profile.availability_end ? new Date(profile.availability_end) : null
      },
      experience: experiences?.map((exp: any) => ({
        id: exp.id,
        title: exp.title,
        company: exp.company,
        startDate: exp.start_date ? new Date(exp.start_date) : new Date(),
        endDate: exp.end_date ? new Date(exp.end_date) : null,
        description: exp.description || '',
        isCurrent: exp.is_current,
        location: exp.location || ''
      })) || []
    },
    documents: documents?.map((doc: any) => ({
      id: doc.id,
      name: doc.name,
      type: doc.file_type || doc.type, // Support des deux formats
      url: doc.public_url || doc.url,
      filePath: doc.file_path,
      status: doc.status,
      uploadedAt: doc.created_at ? new Date(doc.created_at) : new Date(),
      createdAt: new Date(doc.created_at || Date.now()),
      expiresAt: doc.expires_at ? new Date(doc.expires_at) : null
    })) || [],
    jobMatches: jobMatches?.map((match: any) => ({
      id: match.id,
      jobId: match.job_id,
      status: match.status,
      job: match.job ? {
        id: match.job.id,
        title: match.job.title,
        company: match.job.company_name,
        location: match.job.location,
        hourlyRate: match.job.hourly_rate,
        startDate: new Date(match.job.start_date),
        endDate: new Date(match.job.end_date)
      } : null
    })) || []
  };
}
