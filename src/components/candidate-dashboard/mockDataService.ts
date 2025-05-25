// Mock data service pour remplacer temporairement Supabase
export const mockData = {
  currentUser: {
    id: 'mock-user-1',
    email: 'test@example.com',
    user_metadata: {
      full_name: 'Jean Dupont'
    }
  },
  
  candidateProfile: {
    id: 'mock-profile-1',
    user_id: 'mock-user-1',
    full_name: 'Jean Dupont',
    email: 'test@example.com',
    phone: '+33123456789',
    location: 'Paris, France',
    avatar_url: null,
    bio: 'Développeur Full Stack passionné avec 5 ans d\'expérience',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
    is_available: true,
    hourly_rate: 45,
    availability_start: '2024-01-15',
    availability_end: '2024-12-31',
    rating: 4.8,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  
  experiences: [
    {
      id: 'exp-1',
      candidate_id: 'mock-profile-1',
      title: 'Développeur Senior Full Stack',
      company: 'TechCorp Solutions',
      location: 'Paris, France',
      start_date: '2022-03-01',
      end_date: null,
      is_current: true,
      description: 'Développement d\'applications web modernes avec React et Node.js. Leadership technique d\'une équipe de 4 développeurs.',
      technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'exp-2',
      candidate_id: 'mock-profile-1',
      title: 'Développeur Frontend',
      company: 'StartupInnovante',
      location: 'Lyon, France',
      start_date: '2020-06-15',
      end_date: '2022-02-28',
      is_current: false,
      description: 'Création d\'interfaces utilisateur responsives et accessibles. Optimisation des performances frontend.',
      technologies: ['Vue.js', 'JavaScript', 'SCSS', 'Webpack'],
      created_at: '2024-01-01T00:00:00Z'
    }
  ]
};

// Service mock pour remplacer les appels Supabase
export const mockStaffDataService = {
  async getCurrentUser() {
    console.log('🎭 Mock: getCurrentUser appelé');
    return { data: mockData.currentUser, error: null };
  },
  
  async getProfile(userId) {
    console.log('🎭 Mock: getProfile appelé pour userId:', userId);
    if (userId === mockData.currentUser.id) {
      return { data: mockData.candidateProfile, error: null };
    }
    return { data: null, error: { message: 'Profil non trouvé' } };
  },
  
  async updateProfile(userId, updates) {
    console.log('🎭 Mock: updateProfile appelé');
    console.log('📝 UserId:', userId);
    console.log('📝 Updates:', updates);
    
    // Simuler une mise à jour réussie
    const updatedProfile = { ...mockData.candidateProfile, ...updates };
    mockData.candidateProfile = updatedProfile;
    
    return { data: updatedProfile, error: null };
  },
  
  async getExperiences(candidateId) {
    console.log('🎭 Mock: getExperiences appelé pour candidateId:', candidateId);
    if (candidateId === mockData.candidateProfile.id) {
      return { data: mockData.experiences, error: null };
    }
    return { data: [], error: null };
  },
  
  async addExperience(userId, experience) {
    console.log('🎭 Mock: addExperience appelé');
    console.log('📝 UserId:', userId);
    console.log('📝 Experience:', experience);
    
    const newExperience = {
      id: `exp-${Date.now()}`,
      candidate_id: mockData.candidateProfile.id,
      ...experience,
      created_at: new Date().toISOString()
    };
    
    mockData.experiences.push(newExperience);
    return { data: newExperience, error: null };
  },
  
  async updateExperience(experienceId, updates) {
    console.log('🎭 Mock: updateExperience appelé');
    console.log('📝 ExperienceId:', experienceId);
    console.log('📝 Updates:', updates);
    
    const experienceIndex = mockData.experiences.findIndex(exp => exp.id === experienceId);
    if (experienceIndex !== -1) {
      mockData.experiences[experienceIndex] = { ...mockData.experiences[experienceIndex], ...updates };
      return { data: mockData.experiences[experienceIndex], error: null };
    }
    
    return { data: null, error: { message: 'Expérience non trouvée' } };
  },
  
  async deleteExperience(experienceId) {
    console.log('🎭 Mock: deleteExperience appelé pour id:', experienceId);
    
    const experienceIndex = mockData.experiences.findIndex(exp => exp.id === experienceId);
    if (experienceIndex !== -1) {
      const deletedExperience = mockData.experiences.splice(experienceIndex, 1)[0];
      return { data: deletedExperience, error: null };
    }
    
    return { data: null, error: { message: 'Expérience non trouvée' } };
  }
};

export default mockStaffDataService;
