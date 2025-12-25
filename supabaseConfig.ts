import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xfjoepojvoytskcqdugz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhmam9lcG9qdm95dHNrY3FkdWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MzU5MDUsImV4cCI6MjA4MjIxMTkwNX0.5zNzGN3pTQ7lhdcUef7ethqmQpvKUPCecii3VQIlrVg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
