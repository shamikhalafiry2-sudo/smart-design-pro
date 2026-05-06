/* ==========================================
   ai.js - الذكاء الاصطناعي (API حقيقي + محاكاة احتياطية)
   ========================================== */
let generateDesignFromPrompt, applyDesignToCanvas;

const _aiWait = setInterval(() => {
    if (typeof canvas !== 'undefined' && canvas) {
        clearInterval(_aiWait);

        generateDesignFromPrompt = async function(prompt, type = 'poster') {
            try {
                const res = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt, type })
                });
                if (res.ok) return await res.json();
                throw new Error('استخدام المحاكاة');
            } catch (e) {
                // محاكاة احتياطية
                const colors = ['#2d1e1e', '#0a1a2a', '#1e2a1e', '#121212'];
                const bg = colors[Math.floor(Math.random() * colors.length)];
                return {
                    title: 'تصميمك',
                    subtitle: prompt,
                    bgColor: bg,
                    titleColor: '#6c63ff',
                    subtitleColor: '#e0e0e0',
                    fontTitle: 'Cairo',
                    fontSubtitle: 'Tajawal',
                    elements: [{ type: 'text', content: prompt, x: 0.5, y: 0.5, fontSize: 32 }]
                };
            }
        };

        applyDesignToCanvas = function(design) {
            if (typeof clearCanvas === 'function') clearCanvas();
            if (typeof setBackgroundColor === 'function') setBackgroundColor(design.bgColor || '#1e1e2f');
            
            design.elements.forEach((el, i) => {
                if (el.type === 'text') {
                    const txt = new fabric.IText(el.content, {
                        left: el.x * canvas.width,
                        top: el.y * canvas.height,
                        fontFamily: el.fontFamily || design.fontTitle || 'Cairo',
                        fill: el.color || design.titleColor || '#fff',
                        fontSize: el.fontSize || 36,
                        fontWeight: el.fontWeight || 'normal',
                        originX: 'center',
                        originY: 'center',
                        editable: true,
                    });
                    canvas.add(txt);
                    txt.set({ opacity: 0 });
                    txt.animate('opacity', 1, { duration: 300, delay: i * 80, onChange: () => canvas.forceRender() });
                }
            });
            
            canvas.forceRender();
            if (typeof saveState === 'function') saveState();
            if (typeof updateLayersList === 'function') updateLayersList();
        };

        console.log('✅ ai.js جاهز');
    }
}, 100);
