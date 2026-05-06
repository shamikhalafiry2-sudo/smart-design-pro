/* ==========================================
   layers.js - إدارة الطبقات
   ========================================== */
let updateLayersList, bringForward, sendBackward;

const _layersWait = setInterval(() => {
    if (typeof canvas !== 'undefined' && canvas) {
        clearInterval(_layersWait);
        
        updateLayersList = function() {
            const list = document.getElementById('layersList');
            if (!list || !canvas) return;
            list.innerHTML = '';
            const objects = canvas.getObjects().slice().reverse();
            objects.forEach((obj, i) => {
                const li = document.createElement('li');
                li.textContent = obj.type === 'i-text' ? '✏️ ' + (obj.text || '').substring(0, 15) : '🖼️ صورة';
                if (obj === canvas.getActiveObject()) li.classList.add('active');
                li.addEventListener('click', () => {
                    const idx = canvas.getObjects().length - 1 - i;
                    const target = canvas.getObjects()[idx];
                    if (target) {
                        canvas.setActiveObject(target);
                        canvas.forceRender();
                        updateLayersList();
                    }
                });
                list.appendChild(li);
            });
        };
        
        bringForward = function() {
            const obj = canvas.getActiveObject();
            if (obj) {
                const idx = canvas.getObjects().indexOf(obj);
                if (idx < canvas.getObjects().length - 1) {
                    canvas.moveTo(obj, idx + 1);
                    canvas.forceRender();
                    if (typeof saveState === 'function') saveState();
                    updateLayersList();
                }
            }
        };
        
        sendBackward = function() {
            const obj = canvas.getActiveObject();
            if (obj) {
                const idx = canvas.getObjects().indexOf(obj);
                if (idx > 0) {
                    canvas.moveTo(obj, idx - 1);
                    canvas.forceRender();
                    if (typeof saveState === 'function') saveState();
                    updateLayersList();
                }
            }
        };
        
        canvas.on('object:added', updateLayersList);
        canvas.on('object:removed', updateLayersList);
        canvas.on('selection:created', updateLayersList);
        canvas.on('selection:updated', updateLayersList);
        canvas.on('selection:cleared', updateLayersList);
        updateLayersList();
        console.log('✅ layers.js جاهز');
    }
}, 100);