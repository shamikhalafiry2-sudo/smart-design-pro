/* ==========================================
   pen-tool.js - أداة القلم
   ========================================== */
const _penWait = setInterval(() => {
    if (typeof canvas !== 'undefined' && canvas) {
        clearInterval(_penWait);

        let penActive = false, penPoints = [], penPath = null;

        window.enablePenTool = () => {
            penActive = true; penPoints = [];
            canvas.selection = false; canvas.defaultCursor = 'crosshair';
            const m = document.getElementById('penModal'); if (m) m.style.display = 'flex';
        };
        window.disablePenTool = () => {
            penActive = false; canvas.selection = true; canvas.defaultCursor = 'default';
            if (penPath) { canvas.remove(penPath); canvas.forceRender(); }
            penPath = null; penPoints = [];
            const m = document.getElementById('penModal'); if (m) m.style.display = 'none';
        };
        window.finishPenPath = () => {
            if (penPoints.length >= 3) alert('تم إنشاء المسار بنجاح');
            disablePenTool();
        };

        canvas.on('mouse:down', (opt) => {
            if (!penActive) return;
            const p = canvas.getPointer(opt.e);
            penPoints.push({ x: p.x, y: p.y });
            if (penPath) canvas.remove(penPath);
            if (penPoints.length >= 2) {
                let d = '';
                penPoints.forEach((pt, i) => d += (i === 0 ? 'M' : 'L') + pt.x + ',' + pt.y);
                penPath = new fabric.Path(d, {
                    fill: 'transparent', stroke: '#6c63ff', strokeWidth: 2,
                    selectable: false, evented: false
                });
                canvas.add(penPath); canvas.forceRender();
            }
        });

        console.log('✅ pen-tool.js جاهز');
    }
}, 100);