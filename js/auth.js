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

// Função que decide para onde o usuário vai
function redirecionarPorRole(session) {
    try {
        const payload = JSON.parse(atob(session.access_token.split('.')[1]));
        const role = payload.user_role;

        if (role === 'motorista') {
            window.location.href = "app-motorista.html";
        } else {
            window.location.href = "dashboard.html";
        }
    } catch (e) {
        // Se der erro ao ler o token, joga pro dashboard (seguro)
        window.location.href = "dashboard.html";
    }
}
