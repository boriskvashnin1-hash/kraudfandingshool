// Главный скрипт
import { renderHeader, initHeader } from './js/header.js';

document.addEventListener('DOMContentLoaded', function() {
    // Загружаем шапку на все страницы
    const headerContainer = document.getElementById('headerContainer');
    if (headerContainer) {
        headerContainer.innerHTML = renderHeader();
        initHeader();
    }
    
    // Инициализируем меню
    initMobileMenu();
    
    // Инициализируем модальное окно
    initAuthModal();
    
    // Загружаем проекты на главной
    if (document.getElementById('featuredProjects')) {
        loadFeaturedProjects();
    }
});

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

function initAuthModal() {
    const authButton = document.getElementById('authButton');
    const authModal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.close');
    
    if (authButton) {
        authButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (authModal) {
                authModal.style.display = 'block';
            }
        });
    }
    
    if (closeBtn && authModal) {
        closeBtn.addEventListener('click', () => {
            authModal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.style.display = 'none';
            }
        });
    }
}

// Функция загрузки проектов (заглушка)
function loadFeaturedProjects() {
    const projectsGrid = document.getElementById('featuredProjects');
    if (!projectsGrid) return;
    
    const projects = [
        {
            id: 1,
            title: "Экологичная упаковка",
            description: "Разработка биоразлагаемой упаковки для продуктов питания",
            goal: 500000,
            raised: 325000,
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "Образовательное приложение",
            description: "Интерактивное приложение для изучения математики детьми",
            goal: 300000,
            raised: 210000,
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            title: "Социальный театр",
            description: "Создание передвижного театра для отдаленных районов",
            goal: 750000,
            raised: 420000,
            image: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];
    
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        const progress = (project.raised / project.goal * 100).toFixed(1);
        
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-goal">
                    <div>Собрано: ${project.raised.toLocaleString()} ₽ из ${project.goal.toLocaleString()} ₽</div>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progress}%"></div>
                </div>
                <div>${progress}% завершено</div>
                <button class="btn-primary" style="width: 100%; margin-top: 1rem;" onclick="supportProject(${project.id})">Поддержать</button>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
}

// Глобальные функции
window.supportProject = function(projectId) {
    alert(`Поддержка проекта #${projectId} (в реальном приложении здесь будет форма доната)`);
};
