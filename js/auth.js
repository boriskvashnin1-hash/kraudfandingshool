import { supabaseClient } from './config.js';

class AuthService {
    constructor() {
        this.user = null;
        this.init();
    }
    
    async init() {
        // Проверяем текущую сессию
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            this.user = session.user;
        }
        
        // Слушаем изменения аутентификации
        supabaseClient.auth.onAuthStateChange((event, session) => {
            this.user = session?.user || null;
            this.updateUI();
        });
    }
    
    async signUp(email, password, username) {
        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username
                    }
                }
            });
            
            if (error) throw error;
            
            // Создаем профиль пользователя
            if (data.user) {
                await this.createProfile(data.user.id, username, email);
            }
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Ошибка регистрации:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    async signIn(email, password) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Ошибка входа:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    async signOut() {
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;
            
            this.user = null;
            this.updateUI();
            
            return { success: true };
        } catch (error) {
            console.error('Ошибка выхода:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    async createProfile(userId, username, email) {
        try {
            const { error } = await supabaseClient
                .from('profiles')
                .insert([
                    {
                        id: userId,
                        username: username,
                        email: email,
                        created_at: new Date().toISOString(),
                        role: 'user'
                    }
                ]);
            
            if (error) throw error;
            
            return { success: true };
        } catch (error) {
            console.error('Ошибка создания профиля:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    updateUI() {
        const authButton = document.getElementById('authButton');
        if (!authButton) return;
        
        if (this.user) {
            authButton.textContent = 'Профиль';
            authButton.href = 'pages/profile.html';
            authButton.onclick = null;
        } else {
            authButton.textContent = 'Войти';
            authButton.href = '#';
            authButton.onclick = () => {
                document.getElementById('authModal').style.display = 'block';
            };
        }
    }
    
    getCurrentUser() {
        return this.user;
    }
    
    isAuthenticated() {
        return !!this.user;
    }
}

export const authService = new AuthService();
