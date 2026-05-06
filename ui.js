/* ==========================================
   ui.js - ربط الواجهة
   ========================================== */
const _uiWait = setInterval(() => {
    if (typeof canvas !== 'undefined' && canvas && typeof addText !== 'undefined') {
        clearInterval(_uiWait);
// ===== أزرار الشريط العلوي =====
document.getElementById('undoBtnTop')?.addEventListener('click', undo);
document.getElementById('redoBtnTop')?.addEventListener('click', redo);
document.getElementById('deleteBtnTop')?.addEventListener('click', deleteActiveObject);
document.getElementById('cropBtnTop')?.addEventListener('click', () => alert('أداة القص قيد التطوير'));
document.getElementById('penToolBtnTop')?.addEventListener('click', enablePenTool);
document.getElementById('ttsBtnTop')?.addEventListener('click', openTTSModal);
document.getElementById('faceEditBtnTop')?.addEventListener('click', openFaceModal);
document.getElementById('zoomInBtnTop')?.addEventListener('click', () => zoomImage(1.1));
document.getElementById('zoomOutBtnTop')?.addEventListener('click', () => zoomImage(0.9));
       
       
       
       
        // ===== زر القائمة (لإظهار وإخفاء الشريط الجانبي) =====
        // أزرار الشريط العلوي
document.getElementById('cropBtnTop')?.addEventListener('click', () => alert('أداة القص قيد التطوير'));
document.getElementById('penToolBtnTop')?.addEventListener('click', enablePenTool);
document.getElementById('ttsBtnTop')?.addEventListener('click', openTTSModal);
document.getElementById('faceEditBtnTop')?.addEventListener('click', openFaceModal);
document.getElementById('zoomInBtnTop')?.addEventListener('click', () => zoomImage(1.1));
document.getElementById('zoomOutBtnTop')?.addEventListener('click', () => zoomImage(0.9));
        document.getElementById('menuToggle')?.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.toggle('open');
            }
        });

        // إغلاق الشريط الجانبي عند النقر على الكانفاس
        canvas.on('mouse:down', () => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });

        // ===== شاشة البداية =====
        document.getElementById('uploadImageBtn')?.addEventListener('click', () => document.getElementById('imageUploadStart').click());
        document.getElementById('imageUploadStart')?.addEventListener('change', (e) => {
            if (e.target.files[0]) { addImageFromFile(e.target.files[0]); document.getElementById('startScreen').classList.add('hidden'); document.getElementById('editorContainer').style.display = 'flex'; }
        });
        document.getElementById('generateFromPrompt')?.addEventListener('click', async () => {
            const p = document.getElementById('startPrompt').value.trim();
            if (!p) return alert('اكتب وصفاً');
            const d = await generateDesignFromPrompt(p);
            applyDesignToCanvas(d);
            document.getElementById('startScreen').classList.add('hidden');
            document.getElementById('editorContainer').style.display = 'flex';
        });
        document.getElementById('backToStart')?.addEventListener('click', () => {
            document.getElementById('startScreen').classList.remove('hidden');
            document.getElementById('editorContainer').style.display = 'none';
        });

        // ===== أدوات AI =====
        document.getElementById('generateAIBtn')?.addEventListener('click', async () => {
            const p = document.getElementById('aiPrompt').value.trim();
            if (p) { const d = await generateDesignFromPrompt(p); applyDesignToCanvas(d); }
        });
        document.getElementById('generateLogoBtn')?.addEventListener('click', async () => {
            const p = document.getElementById('logoPrompt').value.trim();
            if (p) { const d = await generateDesignFromPrompt(p, 'logo'); applyDesignToCanvas(d); }
        });

        // ===== أدوات يدوية =====
        document.getElementById('addTextBtn')?.addEventListener('click', () => addText());
        document.getElementById('addImageBtn')?.addEventListener('click', () => document.getElementById('imageUpload').click());
        document.getElementById('imageUpload')?.addEventListener('change', (e) => { if (e.target.files[0]) addImageFromFile(e.target.files[0]); });
        document.getElementById('bgColorPicker')?.addEventListener('input', (e) => setBackgroundColor(e.target.value));

        // ===== تراجع وإعادة وتصدير =====
        document.getElementById('undoBtn')?.addEventListener('click', undo);
        document.getElementById('redoBtn')?.addEventListener('click', redo);
        document.getElementById('exportBtn')?.addEventListener('click', exportPNG);

        // ===== شريط الأدوات السفلي =====
        document.getElementById('zoomInBtn')?.addEventListener('click', () => zoomImage(1.1));
        document.getElementById('zoomOutBtn')?.addEventListener('click', () => zoomImage(0.9));
        document.getElementById('penToolBtn')?.addEventListener('click', enablePenTool);
        document.getElementById('ttsBtn')?.addEventListener('click', openTTSModal);
        document.getElementById('faceEditBtn')?.addEventListener('click', openFaceModal);

        // ===== نوافذ =====
        document.getElementById('finishPenBtn')?.addEventListener('click', finishPenPath);
        document.getElementById('cancelPenBtn')?.addEventListener('click', disablePenTool);
        document.getElementById('applyFaceBtn')?.addEventListener('click', applyFaceChanges);
        document.getElementById('speakBtn')?.addEventListener('click', speakText);

        // ===== طبقات =====
        document.getElementById('bringForward')?.addEventListener('click', bringForward);
        document.getElementById('sendBackward')?.addEventListener('click', sendBackward);

        // ===== إغلاق النوافذ =====
        document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', (e) => { if (e.target === m) m.style.display = 'none'; }));

        console.log('✅ ui.js جاهز - جميع الأزرار مفعلة');
    }
}, 100);