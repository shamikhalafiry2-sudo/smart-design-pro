// انتظار canvas
const waitForCanvas = setInterval(() => {
    if (typeof canvas !== 'undefined' && canvas) {
        clearInterval(waitForCanvas);
        // ضع باقي كود الملف هنا
    }
}, 100);
async function generateDesignFromPrompt(prompt, type = 'poster') {
    // محاولة API حقيقي (عند النشر على Vercel)
    try {
        const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, type })
        });
        if (res.ok) return await res.json();
    } catch (e) { /* تجاهل */ }

    // محاكاة إبداعية
    const colors = ['#2d1e1e', '#0a1a2a', '#1e2a1e', '#2d2d44', '#121212'];
    const titles = ['تصميمك الرائع', 'إبداع بلا حدود', 'لمسة فنية', 'فكرتك تتجسد'];
    const bg = colors[Math.floor(Math.random() * colors.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];

    return {
        title: title,
        subtitle: prompt,
        bgColor: bg,
        titleColor: '#6c63ff',
        subtitleColor: '#e0e0e0',
        fontTitle: 'Cairo',
        fontSubtitle: 'Tajawal',
        elements: [
            { type: 'text', content: prompt, x: 0.5, y: 0.5, fontSize: 32, color: '#ffffff' }
        ]
    };
}

function applyDesignToCanvas(design) {
    clearCanvas();
    setBackgroundColor(design.bgColor || '#1e1e2f');
    design.elements.forEach((el, i) => {
        if (el.type === 'text') {
            const t = new fabric.IText(el.content, {
                left: el.x * canvas.width,
                top: el.y * canvas.height,
                fontFamily: el.fontFamily || design.fontTitle || 'Cairo',
                fill: el.color || design.titleColor || '#fff',
                fontSize: el.fontSize || 32,
                originX: 'center',
                originY: 'center',
                editable: true
            });
            canvas.add(t);
            t.set({ opacity: 0 });
            t.animate('opacity', 1, { duration: 300, delay: i * 70, onChange: () => canvas.forceRender() });
        }
    });
    canvas.forceRender();
    saveState();
    if (typeof updateLayersList === 'function') updateLayersList();
}