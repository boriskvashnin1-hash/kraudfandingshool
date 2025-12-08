import { dbService } from './database.js';
import { authService } from './auth.js';

class ProjectsUI {
    constructor() {
        this.currentPage = 1;
        this.projectsPerPage = 6;
    }
    
    async loadProjects(containerId, featured = false) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '<div class="loading">Загрузка проектов...</div>';
        
        const offset = (this.currentPage - 1) * this.projectsPerPage;
        const result = await dbService.getProjects(this.projectsPerPage, offset);
        
        if (!result.success) {
            container.innerHTML = '<div class="error">Ошибка загрузки проектов</div>';
            return;
        }
        
        const projects = featured ? result.data.slice(0, 3) : result.data;
        
        if (projects.length === 0) {
            container.innerHTML = '<div class="no-projects">Проектов пока нет</div>';
            return;
        }
        
        this.renderProjects(projects, container);
    }
    
    renderProjects(projects, container) {
        container.innerHTML = '';
        
        projects.forEach(project => {
            const progress = project.goal > 0 ? (project.raised / project.goal * 100).toFixed(1) : 0;
            
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <img src="${project.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" 
                     alt="${project.title}" class="project-image">
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-meta">
                        <span><i class="fas fa-user"></i> ${project.profiles?.username || 'Автор'}</span>
                        <span><i class="fas fa-calendar"></i> ${new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                    <div class="project-goal">
                        <div>Собрано: ${project.raised?.toLocaleString() || 0} ₽ из ${project.goal.toLocaleString()} ₽</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${progress}%"></div>
                    </div>
                    <div>${progress}% завершено</div>
                    <button class="btn-primary support-btn" data-project-id="${project.id}" style="width: 100%; margin-top: 1rem;">
                        Поддержать
                    </button>
                </div>
            `;
            
            container.appendChild(projectCard);
        });
        
        // Добавляем обработчики для кнопок поддержки
        this.addSupportListeners();
    }
    
    addSupportListeners() {
        document.querySelectorAll('.support-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                if (!authService.isAuthenticated()) {
                    alert('Пожалуйста, войдите в систему, чтобы поддержать проект');
                    document.getElementById('authModal').style.display = 'block';
                    return;
                }
                
                const projectId = e.target.dataset.projectId;
                this.showDonationModal(projectId);
            });
        });
    }
    
    async showDonationModal(projectId) {
        // Создаем модальное окно для доната
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Поддержать проект</h2>
                <form id="donationForm">
                    <input type="number" id="donationAmount" placeholder="Сумма (₽)" min="100" required>
                    <textarea id="donationMessage" placeholder="Ваше сообщение (необязательно)" rows="3"></textarea>
                    <button type="submit" class="btn-primary">Поддержать</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        // Закрытие модального окна
        modal.querySelector('.close').addEventListener('click', () => {
            modal.remove();
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Обработка формы
        modal.querySelector('#donationForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = parseInt(document.getElementById('donationAmount').value);
            const message = document.getElementById('donationMessage').value;
            const user = authService.getCurrentUser();
            
            if (amount < 100) {
                alert('Минимальная сумма поддержки - 100 ₽');
                return;
            }
            
            const donationData = {
                project_id: projectId,
                user_id: user.id,
                amount: amount,
                message: message,
                created_at: new Date().toISOString()
            };
            
            const result = await dbService.createDonation(donationData);
            
            if (result.success) {
                alert('Спасибо за вашу поддержку!');
                modal.remove();
                this.loadProjects('projectsContainer'); // Обновляем список
            } else {
                alert('Ошибка при обработке доната: ' + result.error);
            }
        });
    }
}

export const projectsUI = new ProjectsUI();
