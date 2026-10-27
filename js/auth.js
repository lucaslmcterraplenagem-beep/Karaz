document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const btnLogin = document.getElementById('btn-login');
    const errorMsg = document.getElementById('error-message');

    supabaseClient.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            window.location.href = "dashboard.html";
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        btnLogin.innerHTML = "Entrando...";
        btnLogin.disabled = true;
        errorMsg.classList.add('hidden');

        let email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // AQUI ESTÁ A MÁGICA QUE FALTAVA:
        // Se o usuário digitou 11 números (CPF), transforma no e-mail interno
        if (email.length === 11 && /^\d+$/.test(email)) {
            email = email + '@colaborador.karaz.com';
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            // Mostra o erro real do Supabase (para ajudar a debugar)
            errorMsg.innerText = "Erro: " + error.message;
            errorMsg.classList.remove('hidden');
            btnLogin.innerHTML = "Acessar Sistema";
            btnLogin.disabled = false;
        } else {
            window.location.href = "dashboard.html";
        }
    });
});
