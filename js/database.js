import { supabaseClient } from './config.js';

class DatabaseService {
    
    // Профили пользователей
    async getProfile(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Ошибка получения профиля:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    async updateProfile(userId, updates) {
        try {
            const { data, error } = await supabaseClient
                .from('profiles')
                .update(updates)
                .eq('id', userId);
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Ошибка обновления профиля:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    // Проекты
    async getProjects(limit = 10, offset = 0) {
        try {
            const { data, error } = await supabaseClient
                .from('projects')
                .select('*, profiles(username)')
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Ошибка получения проектов:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    async getProjectById(projectId) {
        try {
            const { data, error } = await supabaseClient
                .from('projects')
                .select('*, profiles(username)')
                .eq('id', projectId)
                .single();
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Ошибка получения проекта:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    async createProject(projectData) {
        try {
            const { data, error } = await supabaseClient
                .from('projects')
                .insert([projectData]);
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Ошибка создания проекта:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    async updateProject(projectId, updates) {
        try {
            const { data, error } = await supabaseClient
                .from('projects')
                .update(updates)
                .eq('id', projectId);
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Ошибка обновления проекта:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    // Донаты
    async createDonation(donationData) {
        try {
            const { data, error } = await supabaseClient
                .from('donations')
                .insert([donationData]);
            
            if (error) throw error;
            
            // Обновляем собранную сумму в проекте
            const project = await this.getProjectById(donationData.project_id);
            if (project.success) {
                const newRaised = (project.data.raised || 0) + donationData.amount;
                await this.updateProject(donationData.project_id, { raised: newRaised });
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Ошибка создания доната:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    async getProjectDonations(projectId) {
        try {
            const { data, error } = await supabaseClient
                .from('donations')
                .select('*, profiles(username)')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('Ошибка получения донатов:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    // Админ функции
    async getStats() {
        try {
            // Получаем общую статистику
            const { data: projects, error: projectsError } = await supabaseClient
                .from('projects')
                .select('raised, goal');
            
            const { data: donations, error: donationsError } = await supabaseClient
                .from('donations')
                .select('amount');
            
            const { data: users, error: usersError } = await supabaseClient
                .from('profiles')
                .select('id');
            
            if (projectsError || donationsError || usersError) {
                throw new Error('Ошибка получения статистики');
            }
            
            const totalRaised = projects.reduce((sum, project) => sum + (project.raised || 0), 0);
            const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
            const totalUsers = users.length;
            
            return {
                success: true,
                data: {
                    totalRaised,
                    totalDonations,
                    totalUsers,
                    totalProjects: projects.length
                }
            };
        } catch (error) {
            console.error('Ошибка получения статистики:', error.message);
            return { success: false, error: error.message };
        }
    }
}

export const dbService = new DatabaseService();
