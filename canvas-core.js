/* ==========================================
   canvas-core.js - المحرك الأساسي
   يعرّف canvas كمتغير عالمي لتراه جميع الملفات
   ========================================== */

// تعريف المتغيرات العامة
let canvas;
let saveState, undo, redo;
let addText, addImageFromFile, zoomImage;
let setBackgroundColor, clearCanvas, exportPNG, getActiveObject;
let deleteActiveObject;

// انتظار تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    
    // التحقق من Fabric.js
    if (typeof fabric === 'undefined') {
        alert('خطأ: Fabric.js لم يتم تحميله. تأكد من اتصالك بالإنترنت.');
        return;
    }
    
    // ⭐ تهيئة الكانفاس بأبعاد طولية (رأسية)
    canvas = new fabric.Canvas('designCanvas', {
        width: 600, // عرض أقل
        height: 800, // طول أكبر
        backgroundColor: '#1e1e2f',
        preserveObjectStacking: true,
        renderOnAddRemove: false,
        selection: true,
        stopContextMenu: true,
    });
    
    // جدولة الرسم (أداء)
    let rafPending = false;
    const nativeRender = canvas.renderAll.bind(canvas);
    canvas.renderAll = function() {
        if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(() => {
                nativeRender();
                rafPending = false;
            });
        }
    };
    canvas.forceRender = function() {
        if (rafPending) {
            cancelAnimationFrame(rafPending);
            rafPending = false;
        }
        nativeRender();
    };
    
    // ========== التراجع والإعادة ==========
    let history = [];
    let historyIdx = -1;
    const MAX_HISTORY = 30;
    
    saveState = function() {
        const json = JSON.stringify(canvas.toJSON());
        if (historyIdx < history.length - 1) history = history.slice(0, historyIdx + 1);
        history.push(json);
        if (history.length > MAX_HISTORY) history.shift();
        historyIdx = history.length - 1;
    };
    
    undo = function() {
        if (historyIdx > 0) {
            historyIdx--;
            canvas.loadFromJSON(history[historyIdx], () => {
                canvas.renderAll();
                if (typeof updateLayersList === 'function') updateLayersList();
            });
        }
    };
    
    redo = function() {
        if (historyIdx < history.length - 1) {
            historyIdx++;
            canvas.loadFromJSON(history[historyIdx], () => {
                canvas.renderAll();
                if (typeof updateLayersList === 'function') updateLayersList();
            });
        }
    };
    
    // ========== حذف العنصر النشط ==========
    deleteActiveObject = function() {
        const obj = canvas.getActiveObject();
        if (obj) {
            canvas.remove(obj);
            canvas.forceRender();
            saveState();
            if (typeof updateLayersList === 'function') updateLayersList();
        }
    };
    
    // ========== النصوص (قابلة للسحب) ==========
    addText = function(content, options = {}) {
        content = content || 'نص جديد';
        const fontSize = options.fontSize || 36;
        const text = new fabric.IText(content, {
            left: canvas.width / 2,
            top: canvas.height * 0.15,
            fontFamily: options.fontFamily || 'Cairo',
            fill: options.fill || '#ffffff',
            fontSize: fontSize,
            originX: 'center',
            originY: 'center',
            textAlign: 'center',
            editable: true,
            hasControls: true,
            hasBorders: true,
            selectable: true,
            lockMovementX: false,
            lockMovementY: false,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.forceRender();
        saveState();
        if (typeof updateLayersList === 'function') updateLayersList();
        return text;
    };
    
    // تحرير النص بنقرة مزدوجة
    canvas.on('mouse:dblclick', (opt) => {
        const target = opt.target;
        if (target && target.type === 'i-text') {
            canvas.setActiveObject(target);
            target.enterEditing();
            target.selectAll();
            canvas.forceRender();
        }
    });
    
    // ========== الصور (تملأ الطول - مرفوعة للأعلى - في الوسط) ==========
    addImageFromFile = function(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const maxH = canvas.height * 0.85;
                const maxW = canvas.width * 0.85;
                
                let finalH = maxH;
                let finalW = (img.width / img.height) * finalH;
                
                if (finalW > maxW) {
                    finalW = maxW;
                    finalH = (img.height / img.width) * finalW;
                }
                
                const fabricImg = new fabric.Image(img, {
                    left: (canvas.width - finalW) / 2,
                    top: canvas.height * 0.03,
                    scaleX: finalW / img.width,
                    scaleY: finalH / img.height,
                    lockUniScaling: true,
                    lockUniScalingFlip: true,
                    objectCaching: true,
                    hasControls: true,
                    hasBorders: true,
                    selectable: true,
                });
                
                canvas.add(fabricImg);
                canvas.setActiveObject(fabricImg);
                canvas.forceRender();
                saveState();
                if (typeof updateLayersList === 'function') updateLayersList();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };
    
    // ========== تكبير/تصغير (يحافظ على النسبة) ==========
    zoomImage = function(factor) {
        const obj = canvas.getActiveObject();
        if (obj && obj.type === 'image') {
            const s = Math.max(0.1, Math.min(10, (obj.scaleX || 1) * factor));
            obj.set({ scaleX: s, scaleY: s });
            obj.setCoords();
            canvas.forceRender();
            saveState();
        }
    };
    
    // ========== دوال مساعدة ==========
    setBackgroundColor = function(color) {
        canvas.backgroundColor = color;
        canvas.forceRender();
        saveState();
    };
    
    clearCanvas = function() {
        canvas.clear();
        canvas.backgroundColor = '#1e1e2f';
        canvas.forceRender();
        saveState();
        if (typeof updateLayersList === 'function') updateLayersList();
    };
    
    // ⭐ تصدير PNG (الكامل بجودة عالية)
    exportPNG = function() {
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2,
            width: canvas.width,
            height: canvas.height,
            left: 0,
            top: 0,
        });
        const link = document.createElement('a');
        link.download = 'تصميم.png';
        link.href = dataURL;
        link.click();
    };
    
    getActiveObject = function() {
        return canvas.getActiveObject();
    };
    
    // الحالة الأولية
    saveState();
    console.log('✅ canvas-core.js جاهز - أبعاد طولية 600×800');
});