// Базовый скрипт для работы сайта

document.addEventListener('DOMContentLoaded', function() {
    // Меню для мобильных устройств
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Модальное окно авторизации
    const authButton = document.getElementById('authButton');
    const authModal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.close');
    const registerBtn = document.getElementById('registerBtn');
    const authForm = document.getElementById('authForm');
    
    if (authButton) {
        authButton.addEventListener('click', () => {
            authModal.style.display = 'block';
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            authModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });
    
    // Обработка формы авторизации (заглушка)
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('authEmail').value;
            const password = document.getElementById('authPassword').value;
            
            // Временная заглушка
            alert(`Вход выполнен для: ${email}`);
            authModal.style.display = 'none';
            
            // Изменяем кнопку на "Профиль"
            authButton.textContent = 'Профиль';
            authButton.href = 'pages/profile.html';
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            alert('Регистрация (в реальном приложении здесь будет регистрация)');
        });
    }
    
    // Загрузка примеров проектов
    loadFeaturedProjects();
});

// Функция загрузки проектов
function loadFeaturedProjects() {
    const projectsGrid = document.getElementById('featuredProjects');
    
    if (!projectsGrid) return;
    
    // Примерные данные проектов
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
    
    // Очищаем контейнер
    projectsGrid.innerHTML = '';
    
    // Добавляем проекты
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
                <button class="btn-primary" style="width: 100%; margin-top: 1rem;">Поддержать</button>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
}

// Локальное хранилище для имитации базы данных
class LocalStorageDB {
    constructor() {
        this.storageKey = 'helprojects_data';
        this.initStorage();
    }
    
    initStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = {
                users: [],
                projects: [],
                donations: []
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialData));
        }
    }
    
    getData() {
        return JSON.parse(localStorage.getItem(this.storageKey));
    }
    
    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
    
    addUser(user) {
        const data = this.getData();
        user.id = Date.now();
        data.users.push(user);
        this.saveData(data);
        return user;
    }
    
    addProject(project) {
        const data = this.getData();
        project.id = Date.now();
        project.createdAt = new Date().toISOString();
        data.projects.push(project);
        this.saveData(data);
        return project;
    }
    
    getProjects() {
        return this.getData().projects;
    }
}

// Экспортируем для использования в других файлах
window.localDB = new LocalStorageDB();
