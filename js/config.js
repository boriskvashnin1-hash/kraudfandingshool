// Конфигурация Supabase
const SUPABASE_URL = https://njccbuhncnjudlgszcfd.supabase.co;
const SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qY2NidWhuY25qdWRsZ3N6Y2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwOTUyNzAsImV4cCI6MjA4MDY3MTI3MH0.4pgFa5O8Uxe5Q4-id4Oxieg7FOawz7GM4gNxZ0TljR4;

// Инициализация Supabase клиента
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabaseClient };
