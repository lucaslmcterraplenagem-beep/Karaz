document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const btnLogin = document.getElementById('btn-login');
    const errorMsg = document.getElementById('error-message');

    // Usa o nome correto do nosso cliente: supabaseClient
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

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Usa o nome correto do nosso cliente: supabaseClient
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            errorMsg.innerText = "Erro: E-mail ou senha incorretos.";
            errorMsg.classList.remove('hidden');
            btnLogin.innerHTML = "Acessar Sistema";
            btnLogin.disabled = false;
        } else {
            window.location.href = "dashboard.html";
        }
    });
});
