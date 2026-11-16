document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const btnLogin = document.getElementById('btn-login');
    const errorMsg = document.getElementById('error-message');

    // Gera ou recupera o ID único deste dispositivo
    let deviceId = localStorage.getItem('karaz_device_id');
    if (!deviceId) {
        deviceId = crypto.randomUUID ? crypto.randomUUID() : 'dev_' + Math.random().toString(36).substring(2);
        localStorage.setItem('karaz_device_id', deviceId);
    }

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

        // Transforma CPF em e-mail interno
        if (email.length === 11 && /^\d+$/.test(email)) {
            email = email + '@colaborador.karaz.com';
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

        if (error) {
            // Exibe o erro na tela
            errorMsg.innerText = "Erro: CPF/E-mail ou senha incorretos.";
            errorMsg.classList.remove('hidden');
            btnLogin.innerHTML = "Acessar Sistema";
            btnLogin.disabled = false;

            // --- SISTEMA DE SEGURANÇA (HONEYPOT) ---
            registrarFalhaLogin(email, error.message);
            
        } else {
            redirecionarPorRole(data.session);
        }
    });
});

// Função que registra a tentativa falha (IP + Device ID)
async function registrarFalhaLogin(emailTentado, erroOriginal) {
    try {
        // Pega o IP do usuário via API pública
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        const ip = ipData.ip;

        const deviceId = localStorage.getItem('karaz_device_id');

        // Salva no Supabase
        await supabaseClient.from('logs_seguranca').insert([{
            cpf_ou_email: emailTentado,
            device_id: deviceId,
            ip_address: ip,
            motivo: erroOriginal
        }]);
        
        console.log("Log de segurança registrado com sucesso.");
    } catch (err) {
        console.warn("Não foi possível registrar o log de segurança:", err);
    }
}

// Função que decide para onde o usuário vai
async function redirecionarPorRole(session) {
    try {
        const { data, error } = await supabaseClient
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

        if (error || !data) {
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
