const users = [
  {
    id: 1,
    username: 'manatsawin',
    email: 'manatsawin@example.com',
    profile: {
      first_name: 'Manatsawin',
      last_name: 'Developer',
      avatar_url: 'https://example.com/avatars/manatsawin.png',
      phone: '0812345678',
    },
    role: 'Admin',
    permissions: [
      'create_project',
      'edit_project',
      'delete_project',
      'manage_users',
    ],
    status: 'active',
    created_at: '2026-01-10T08:30:00Z',
    updated_at: '2026-10-18T14:20:00Z',
  },
  {
    id: 2,
    username: 'phui_colleague',
    email: 'phui@example.com',
    profile: {
      first_name: 'Hui',
      last_name: 'Engineer',
      avatar_url: null,
      phone: '0898765432',
    },
    role: 'Editor',
    permissions: ['create_project', 'edit_project'],
    status: 'active',
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-09-01T09:15:00Z',
  },
];

export default users;
