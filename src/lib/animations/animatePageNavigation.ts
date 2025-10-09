import gsap from 'gsap';

const colors = ['#A5C347', '#FF236C', '#5AE6FF', '#5D58EF', '#F0AA00', '#FF9800', '#00BFA6'];
const textColors = ['#FFEB3B', '#FFFFFF', '#000000', '#F8BBD0', '#D500F9', '#FFC107', '#00E676']; // Màu chữ khác màu nền
let columnsContainer: HTMLDivElement | null = null;
const numCols = 20; // Số thanh nhiều hơn

// Tạo container cột
function createColumns() {
    if (columnsContainer) return columnsContainer;

    columnsContainer = document.createElement('div');
    Object.assign(columnsContainer.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        zIndex: '9999',
        pointerEvents: 'none',
    });

    for (let i = 0; i < numCols; i++) {
        const color = colors[i % colors.length];
        const col = document.createElement('div');
        Object.assign(col.style, {
            flex: '1',
            backgroundColor: color,
            transform: 'translateY(-100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#fff',
            position: 'relative',
        });

        // Gán chữ LOADING cho 7 thanh rải đều
        const loadingChars = ['L', 'O', 'A', 'D', 'I', 'N', 'G'];
        if (i >= 3 && i < 10) {
            const charIdx = i - 3;
            const char = document.createElement('span');
            char.innerText = loadingChars[charIdx] ?? '';

            // Chọn màu chữ khác màu nền (ép kiểu string)
            let textColor = textColors[(i - 3) % textColors.length] ?? '#fff';
            if (textColor === color) {
                textColor = textColors[(i - 2) % textColors.length] ?? '#fff';
            }

            char.style.color = textColor;
            col.appendChild(char);
        }

        columnsContainer.appendChild(col);
    }

    document.body.appendChild(columnsContainer);
    return columnsContainer;
}

// Animate page out - cột xuống
export function animatePageOut(
    target: string,
    router: ReturnType<typeof import('next/navigation').useRouter>,
) {
    const container = createColumns();
    const cols = Array.from(container.children) as HTMLDivElement[];

    const tl = gsap.timeline({
        onComplete: () => {
            router.push(target);
        },
    });

    tl.to(cols, {
        y: '0%',
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.inOut',
    });
}

// Animate page in - cột ra khỏi màn hình
export function animatePageIn() {
    if (!columnsContainer) return;
    const cols = Array.from(columnsContainer.children) as HTMLDivElement[];

    gsap.to(cols, {
        y: '-100%',
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.inOut',
    });
}
