document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('toggleMode');
    if (btn) {
        btn.onclick = function() {
            if (document.body.classList.contains('dark-mode')) {
                setLightMode();
            } else {
                setDarkMode();
            }
        };
    }
});

function setDarkMode() {
    document.body.classList.add('dark-mode');
}

function setLightMode() {
    document.body.classList.remove('dark-mode');
}