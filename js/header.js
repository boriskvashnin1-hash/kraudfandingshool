// Общий заголовок для всех страниц
export function renderHeader() {
    return `
        <nav class="navbar">
            <div class="nav-container">
                <a href="/helprojects/index.html" class="logo">HelProjects</a>
                <div class="nav-links">
                    <a href="/helprojects/index.html">Главная</a>
                    <a href="/helprojects/pages/projects.html">Проекты</a>
                    <a href="/helprojects/pages/create.html">Создать проект</a>
                    <a href="/helprojects/pages/profile.html">Профиль</a>
                    <a href="#" id="authButton">Войти</a>
                </div>
                <button class="menu-toggle">☰</button>
            </div>
        </nav>
    `;
}

export function initHeader() {
    // Добавляем обработчики для меню
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}
