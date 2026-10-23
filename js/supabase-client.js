
const SUPABASE_URL = "ijbdtveymsxjanvoipme";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqYmR0dmV5bXN4amFudm9pcG1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NTg4MjMsImV4cCI6MjEwODMzNDgyM30.nFLeCRLb5Vm_bwMv3jiw108BoL6NO_BIJoxeNiD--Fc";

// O SDK do Supabase já cria a variável global 'supabase'.
// Por isso, extraímos a função 'createClient' dela e criamos nosso cliente com um nome diferente.
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
