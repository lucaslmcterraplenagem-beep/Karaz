document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const btnLogin = document.getElementById('btn-login');
    const errorMsg = document.getElementById('error-message');

    supabaseClient.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            redirecionarPorRole(session);
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        btnLogin.innerHTML = "Entrando...";
        btnLogin.disabled = true;
        errorMsg.classList.add('hidden');

        let email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (email.length === 11 && /^\d+$/.test(email)) {
            email = email + '@colaborador.karaz.com';
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

        if (error) {
            errorMsg.innerText = "Erro: " + error.message;
            errorMsg.classList.remove('hidden');
            btnLogin.innerHTML = "Acessar Sistema";
            btnLogin.disabled = false;
        } else {
            redirecionarPorRole(data.session);
        }
    });
});

// Função que decide para onde o usuário vai (AGORA BUSCA NO BANCO DE DADOS)
async function redirecionarPorRole(session) {
    try {
        // Busca a permissão real na tabela user_roles
        const { data, error } = await supabaseClient
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

        if (error || !data) {
            // Se não achar a permissão, joga pro dashboard por segurança
            window.location.href = "dashboard.html";
            return;
        }

        if (data.role === 'motorista') {
            window.location.href = "app-motorista.html";
        } else {
            window.location.href = "dashboard.html";
        }
    } catch (e) {
        window.location.href = "dashboard.html";
    }
}
