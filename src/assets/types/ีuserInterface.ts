export interface UserProfile {
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  phone: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  profile: UserProfile;
  role: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  users: User[];
}
