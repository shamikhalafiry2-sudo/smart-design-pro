/* ==========================================
   alignment.js - المحاذاة
   ========================================== */
const _alignWait = setInterval(() => {
    if (typeof canvas !== 'undefined' && canvas) {
        clearInterval(_alignWait);

        window.alignLeft = () => { const o = canvas.getActiveObject(); if (o) { o.set('left', 0); o.setCoords(); canvas.forceRender(); if (typeof saveState === 'function') saveState(); } };
        window.alignCenterH = () => { const o = canvas.getActiveObject(); if (o) { o.set('left', canvas.width / 2); o.set('originX', 'center'); o.setCoords(); canvas.forceRender(); if (typeof saveState === 'function') saveState(); } };
        window.alignRight = () => { const o = canvas.getActiveObject(); if (o) { o.set('left', canvas.width); o.set('originX', 'right'); o.setCoords(); canvas.forceRender(); if (typeof saveState === 'function') saveState(); } };
        window.alignTop = () => { const o = canvas.getActiveObject(); if (o) { o.set('top', 0); o.setCoords(); canvas.forceRender(); if (typeof saveState === 'function') saveState(); } };
        window.alignMiddleV = () => { const o = canvas.getActiveObject(); if (o) { o.set('top', canvas.height / 2); o.set('originY', 'center'); o.setCoords(); canvas.forceRender(); if (typeof saveState === 'function') saveState(); } };
        window.alignBottom = () => { const o = canvas.getActiveObject(); if (o) { o.set('top', canvas.height); o.set('originY', 'bottom'); o.setCoords(); canvas.forceRender(); if (typeof saveState === 'function') saveState(); } };

        console.log('✅ alignment.js جاهز');
    }
}, 100);