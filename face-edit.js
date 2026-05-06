/* ==========================================
   face-edit.js - تعديل الوجه
   ========================================== */
const _faceWait = setInterval(() => {
    if (typeof canvas !== 'undefined' && canvas) {
        clearInterval(_faceWait);
        window.openFaceModal = () => { const m = document.getElementById('faceModal'); if (m) m.style.display = 'flex'; };
        window.applyFaceChanges = () => { alert('تم تطبيق تعديلات الوجه (محاكاة)'); const m = document.getElementById('faceModal'); if (m) m.style.display = 'none'; };
        console.log('✅ face-edit.js جاهز');
    }
}, 100);