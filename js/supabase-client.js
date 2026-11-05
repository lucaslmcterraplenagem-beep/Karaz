const SUPABASE_URL = "https://ijbdtveymsxjanvoipme.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqYmR0dmV5bXN4amFudm9pcG1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NTg4MjMsImV4cCI6MjEwODMzNDgyM30.nFLeCRLb5Vm_bwMv3jiw108BoL6NO_BIJoxeNiD--Fc";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função global para prevenir ataques XSS
function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
// --- SISTEMA GLOBAL DE NOTIFICAÇÕES (TOAST) ---
function showToast(mensagem, tipo = 'sucesso') {
    // Verifica se o container de toast já existe na tela, se não, cria.
    let container = document.getElementById('toast-global-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-global-container';
        container.className = 'fixed top-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none';
        document.body.appendChild(container);
    }

    // Cria o elemento do toast
    const toast = document.createElement('div');
    
    // Define cores e ícones baseados no tipo
    let bgClass = 'bg-green-500/10 border-green-500 text-green-500';
    let iconName = 'check-circle';
    if (tipo === 'erro') {
        bgClass = 'bg-red-500/10 border-red-500 text-red-500';
        iconName = 'alert-circle';
    } else if (tipo === 'aviso') {
        bgClass = 'bg-yellow-500/10 border-yellow-500 text-yellow-500';
        iconName = 'alert-triangle';
    }

    toast.className = `pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-lg border shadow-lg transform transition-all duration-300 translate-x-[150%] ${bgClass} bg-white dark:bg-slate-800`;
    
    toast.innerHTML = `
        <i data-lucide="${iconName}" class="w-5 h-5 shrink-0"></i>
        <p class="font-medium text-sm">${mensagem}</p>
    `;

    container.appendChild(toast);
    
    // Atualiza os ícones do Lucide para o novo toast
    if(typeof lucide !== 'undefined') lucide.createIcons();

    // Animação para entrar
    setTimeout(() => { toast.classList.remove('translate-x-[150%]'); }, 10);

    // Animação para sair e remover após 4 segundos
    setTimeout(() => {
        toast.classList.add('translate-x-[150%]', 'opacity-0');
        setTimeout(() => { toast.remove(); }, 300);
    }, 4000);
}
