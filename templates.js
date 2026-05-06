/* ==========================================
   templates.js - تحميل القوالب
   ========================================== */
const _tplWait = setInterval(() => {
    if (typeof canvas !== 'undefined' && canvas && typeof applyDesignToCanvas !== 'undefined') {
        clearInterval(_tplWait);
        fetch('templates.json').then(r => r.json()).then(templates => {
            const grid = document.getElementById('templateGrid');
            if (!grid) return;
            grid.innerHTML = templates.map(t => `<div class="template-item" data-id="${t.id}"><i class="fas ${t.icon}"></i><br>${t.name}</div>`).join('');
            document.querySelectorAll('.template-item').forEach(el => {
                el.addEventListener('click', () => {
                    const design = templates.find(t => t.id === el.dataset.id)?.design;
                    if (design) applyDesignToCanvas(design);
                });
            });
        }).catch(() => console.log('templates.json غير موجود'));
        console.log('✅ templates.js جاهز');
    }
}, 100);