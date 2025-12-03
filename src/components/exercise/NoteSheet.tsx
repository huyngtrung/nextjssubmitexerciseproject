'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    X,
    Eraser,
    Undo,
    Redo,
    Minus,
    Square,
    Circle,
    PenTool,
    Palette,
    Droplet,
    ArrowLeft,
    ArrowRight,
} from 'lucide-react';

const TARGET_WIDTH_VW = 70;
const TARGET_HEIGHT_VH = 70;
const MAX_PAGES = 10;

const FIXED_BG_COLOR = '#FFFFFF';

type Tool = 'pen' | 'eraser' | 'line' | 'rect' | 'circle';

export const NoteCanvas: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentColor, setCurrentColor] = useState('#000000');
    const [currentTool, setCurrentTool] = useState<Tool>('pen');
    const [lineThickness, setLineThickness] = useState(5);

    // --- QUẢN LÝ LỊCH SỬ VÀ TRANG ---
    const [currentPage, setCurrentPage] = useState(0);
    const [pageStates, setPageStates] = useState<string[][]>(
        Array(MAX_PAGES)
            .fill(null)
            .map(() => []),
    );

    const history = pageStates[currentPage];
    const [historyIndex, setHistoryIndex] = useState(-1);

    const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });

    const startPoint = useRef({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    // Ref lưu trữ ảnh của trạng thái hiện tại (dùng cho restoreCurrentState nhanh)
    const currentHistoryImage = useRef<HTMLImageElement | null>(null);

    // Ref để lưu trữ ID của tác vụ trì hoãn
    const deferredSaveRef = useRef<number | null>(null);

    // Lấy kích thước pixel thực tế (MEMOIZED)
    const canvasSize = useMemo(() => {
        if (typeof window === 'undefined')
            return { width: 0, height: 0, scale: 1, pixelWidth: 0, pixelHeight: 0 };
        const width = (window.innerWidth * TARGET_WIDTH_VW) / 100;
        const height = (window.innerHeight * TARGET_HEIGHT_VH) / 100;
        const scale = window.devicePixelRatio || 1;
        return {
            width: width,
            height: height,
            scale: scale,
            pixelWidth: Math.floor(width * scale),
            pixelHeight: Math.floor(height * scale),
        };
    }, []);

    // --- CẤU HÌNH CONTEXT & VẼ NỀN ---
    const configureContext = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            const isEraser = currentTool === 'eraser';
            ctx.lineCap = 'round';
            ctx.lineWidth = isEraser ? lineThickness * 2 : lineThickness;
            ctx.strokeStyle = isEraser ? FIXED_BG_COLOR : currentColor;
        },
        [currentTool, lineThickness, currentColor],
    );

    const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = FIXED_BG_COLOR;
        ctx.fillRect(0, 0, width, height);
        ctx.scale(canvasSize.scale, canvasSize.scale);
    };

    const initializeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.style.width = `${canvasSize.width}px`;
        canvas.style.height = `${canvasSize.height}px`;
        canvas.width = canvasSize.pixelWidth;
        canvas.height = canvasSize.pixelHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            contextRef.current = ctx;

            if (history && history.length > 0) {
                restoreState(historyIndex);
            } else {
                drawBackground(ctx, canvas.width, canvas.height);
                saveState(true);
            }
        }
    }, [canvasSize, history, historyIndex]);

    // --- EFFECTS ---
    useEffect(() => {
        if (isOpen) {
            initializeCanvas();
            window.addEventListener('resize', initializeCanvas);
        }

        return () => {
            window.removeEventListener('resize', initializeCanvas);
            if (deferredSaveRef.current) {
                clearTimeout(deferredSaveRef.current);
            }
        };
    }, [isOpen, initializeCanvas]);

    useEffect(() => {
        const ctx = contextRef.current;
        if (ctx) {
            configureContext(ctx);
        }
    }, [currentColor, currentTool, lineThickness, configureContext]);

    // --- LỊCH SỬ VÀ TRANG ---

    // Hàm lưu trạng thái Data URL chính
    const saveState = (forceSave = false) => {
        const canvas = canvasRef.current;
        if (!canvas || !isOpen) return;

        // Xóa bất kỳ tác vụ trì hoãn nào đang chờ
        if (deferredSaveRef.current) {
            clearTimeout(deferredSaveRef.current);
            deferredSaveRef.current = null;
        }

        // --- THAO TÁC NẶNG: Tạo Data URL ---
        const newState = canvas.toDataURL();
        if (history) {
            if (forceSave || newState !== history[historyIndex]) {
                const newHistory = history.slice(0, historyIndex + 1);
                const newPageStates = [...pageStates];
                newPageStates[currentPage] = [...newHistory, newState];

                setPageStates(newPageStates);
                setHistoryIndex(newHistory.length);

                // Cập nhật ref ảnh hiện tại để khôi phục nhanh
                const img = new Image();
                img.src = newState;
                currentHistoryImage.current = img;
            }
        }
    };

    // Hàm lưu trạng thái Data URL với ưu tiên thấp (dùng cho stopDrawing)
    const delayedSaveState = () => {
        if (deferredSaveRef.current) {
            clearTimeout(deferredSaveRef.current);
        }

        // Trì hoãn việc gọi saveState, giảm thiểu độ giật
        deferredSaveRef.current = window.setTimeout(() => {
            saveState(); // Gọi hàm saveState chính
            deferredSaveRef.current = null;
        }, 10); // 10ms là đủ để trình duyệt xử lý xong các tác vụ UI
    };

    // Tải lại trạng thái từ lịch sử
    const restoreState = (index: number) => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        if (!canvas || !ctx) return;

        const scale = canvasSize.scale;

        if (history) {
            if (index < 0 || index >= history.length) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawBackground(ctx, canvas.width, canvas.height);
                configureContext(ctx);
                currentHistoryImage.current = null;
                return;
            }

            const dataUrl = history[index];

            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width / scale, canvas.height / scale);
                configureContext(ctx);
                currentHistoryImage.current = img;
            };

            img.src = dataUrl!;
        }
    };

    // Khôi phục Canvas về trạng thái lịch sử hiện tại (Nhanh, dùng cho vẽ hình dạng)
    const restoreCurrentState = () => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        const img = currentHistoryImage.current;

        if (!canvas || !ctx) return;

        const scale = canvasSize.scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (img) {
            ctx.drawImage(img, 0, 0, canvas.width / scale, canvas.height / scale);
        } else {
            drawBackground(ctx, canvas.width, canvas.height);
        }

        configureContext(ctx);
    };

    const undo = () => {
        if (historyIndex > 0) {
            if (deferredSaveRef.current) {
                clearTimeout(deferredSaveRef.current);
                deferredSaveRef.current = null;
            }

            setHistoryIndex((prev) => prev - 1);
            restoreState(historyIndex - 1);
        }
    };

    const redo = () => {
        if (history && historyIndex < history.length - 1) {
            setHistoryIndex((prev) => prev + 1);
            restoreState(historyIndex + 1);
        }
    };

    const changePage = (newIndex: number) => {
        if (newIndex >= 0 && newIndex < MAX_PAGES) {
            saveState(true);
            setCurrentPage(newIndex);

            setHistoryIndex(pageStates[newIndex]?.length ? pageStates[newIndex].length - 1 : -1);
        }
    };

    // --- HÀM XỬ LÝ VẼ HÌNH DẠNG ---

    const drawShape = (
        ctx: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        tool: Tool,
    ) => {
        configureContext(ctx);
        ctx.beginPath();

        switch (tool) {
            case 'line':
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                break;
            case 'rect': {
                const width = x2 - x1;
                const height = y2 - y1;
                ctx.strokeRect(x1, y1, width, height);
                break;
            }
            case 'circle': {
                const centerX = x1 + (x2 - x1) / 2;
                const centerY = y1 + (y2 - y1) / 2;
                // Tính bán kính dựa trên khoảng cách (chỉnh sửa nhỏ để dễ vẽ hơn)
                const radius = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / 2;

                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                break;
            }
        }
        ctx.stroke();
    };

    // --- HÀM XỬ LÝ SỰ KIỆN VẼ CHÍNH ---

    const getCoords = (
        event: React.MouseEvent | React.TouchEvent,
    ): { offsetX: number; offsetY: number } => {
        const canvas = canvasRef.current;
        if (!canvas) return { offsetX: 0, offsetY: 0 };

        const rect = canvas.getBoundingClientRect();
        let clientX: number;
        let clientY: number;

        if ('touches' in event) {
            let touch;

            // Ưu tiên: touches (cho start/move)
            if (event.touches.length > 0) {
                touch = event.touches[0];
            }
            // Thay thế: changedTouches (cho end/cancel)
            else if (event.changedTouches.length > 0) {
                touch = event.changedTouches[0];
            }

            if (!touch) {
                return { offsetX: 0, offsetY: 0 };
            }

            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            // Xử lý MouseEvent
            clientX = event.clientX;
            clientY = event.clientY;
        }

        const offsetX = clientX - rect.left;
        const offsetY = clientY - rect.top;

        return { offsetX, offsetY };
    };
    const handleMouseMove = (event: React.MouseEvent | React.TouchEvent) => {
        const { offsetX, offsetY } = getCoords(event);

        setCursorPosition({ x: offsetX, y: offsetY });

        if (isDrawing.current) {
            draw(event);
        }
    };

    const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
        if ('touches' in event) {
            event.preventDefault();
        }

        const { offsetX, offsetY } = getCoords(event);
        const ctx = contextRef.current;

        if (ctx) {
            startPoint.current = { x: offsetX, y: offsetY };
            isDrawing.current = true;

            if (currentTool === 'pen' || currentTool === 'eraser') {
                configureContext(ctx);
                ctx.beginPath();
                ctx.moveTo(offsetX, offsetY);
            }
        }
    };

    const draw = (event: React.MouseEvent | React.TouchEvent) => {
        if ('touches' in event) {
            event.preventDefault();
        }

        if (!isDrawing.current || !contextRef.current) {
            return;
        }

        const { offsetX, offsetY } = getCoords(event);
        const ctx = contextRef.current;

        if (currentTool === 'pen' || currentTool === 'eraser') {
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
            // KHÔNG LƯU GÌ TẠI ĐÂY
        } else if (currentTool === 'line' || currentTool === 'rect' || currentTool === 'circle') {
            // VẼ HÌNH DẠNG: CẦN PHỤC HỒI NỀN TRƯỚC VÀ VẼ LẠI HÌNH TẠM THỜI
            restoreCurrentState();
            // KỸ THUẬT QUAN TRỌNG: Gọi drawShape ngay sau restore để hiện hình
            drawShape(
                ctx,
                startPoint.current.x,
                startPoint.current.y,
                offsetX,
                offsetY,
                currentTool,
            );
        }
    };

    const stopDrawing = () => {
        if (!isDrawing.current) return;

        const ctx = contextRef.current;
        if (ctx) {
            if (currentTool === 'pen' || currentTool === 'eraser') {
                ctx.closePath();
            }

            // DÙNG delayedSaveState để giảm giật sau khi nhả chuột
            delayedSaveState();
        }
        isDrawing.current = false;
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if (canvas && context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawBackground(context, canvas.width, canvas.height);
            saveState(true);
        }
    };

    // --- RENDER UI ---
    return (
        <>
            <Button
                variant="outline"
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-50 shadow-lg"
            >
                Mở Bảng Nháp
            </Button>

            <div
                className={cn(
                    'fixed right-0 top-0 h-full w-full bg-white shadow-2xl z-[100] transition-transform duration-300 ease-in-out',
                    'flex flex-col p-6',
                    isOpen ? 'translate-x-0' : 'translate-x-full',
                )}
                style={{ width: '80vw' }}
            >
                {/* HEADER */}
                <div className="flex justify-between items-center pb-4 border-b">
                    <h2 className="text-2xl font-semibold">Bảng Nháp Của Học Sinh</h2>
                    <Button variant="ghost" onClick={() => setIsOpen(false)} size="icon">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* CONTROL PANEL */}
                <div
                    className="flex flex-wrap items-center p-2 border-b mb-4 w-full justify-between gap-2"
                    style={{ maxWidth: `${TARGET_WIDTH_VW}vw` }}
                >
                    {/* 1. Công cụ Vẽ/Tẩy/Hình dạng */}
                    <div className="flex space-x-2">
                        <Button
                            variant={currentTool === 'pen' ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => setCurrentTool('pen')}
                            title="Bút"
                        >
                            <PenTool className="h-5 w-5" />
                        </Button>
                        <Button
                            variant={currentTool === 'eraser' ? 'destructive' : 'outline'}
                            size="icon"
                            onClick={() => setCurrentTool('eraser')}
                            title="Tẩy"
                        >
                            <Eraser className="h-5 w-5" />
                        </Button>
                        <Button
                            variant={currentTool === 'line' ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => setCurrentTool('line')}
                            title="Đường thẳng"
                        >
                            <Minus className="h-5 w-5" />
                        </Button>
                        <Button
                            variant={currentTool === 'rect' ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => setCurrentTool('rect')}
                            title="Hình chữ nhật"
                        >
                            <Square className="h-5 w-5" />
                        </Button>
                        <Button
                            variant={currentTool === 'circle' ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => setCurrentTool('circle')}
                            title="Hình tròn"
                        >
                            <Circle className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* 2. Màu sắc và Độ dày */}
                    <div className="flex items-center space-x-4">
                        {/* Chọn Màu sắc */}
                        <label
                            className="flex items-center space-x-1 cursor-pointer"
                            title="Chọn màu bút"
                        >
                            <Palette className="h-5 w-5" />
                            <input
                                type="color"
                                value={currentColor}
                                onChange={(e) => setCurrentColor(e.target.value)}
                                className="w-8 h-8 rounded-full border-2 cursor-pointer"
                            />
                        </label>

                        {/* Chọn Độ dày */}
                        <label className="flex items-center space-x-1" title="Độ dày nét">
                            <Droplet className="h-5 w-5" />
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={lineThickness}
                                onChange={(e) => setLineThickness(parseInt(e.target.value))}
                                className="w-20 cursor-pointer"
                            />
                            <span className="text-sm">{lineThickness}px</span>
                        </label>
                    </div>

                    {/* 3. Undo/Redo và Hành động */}
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={undo}
                            disabled={historyIndex <= 0}
                            title="Hoàn tác"
                        >
                            <Undo className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={redo}
                            disabled={historyIndex >= (history?.length ?? 0) - 1}
                            title="Làm lại"
                        >
                            <Redo className="h-5 w-5" />
                        </Button>

                        <Button variant="secondary" onClick={clearCanvas}>
                            Xóa Bảng
                        </Button>
                    </div>
                </div>

                {/* --- CANVAS AREA VÀ PAGINATION --- */}
                <div className="flex flex-col items-center flex-grow">
                    <div
                        style={{
                            border: '1px solid #ccc',
                            backgroundColor: FIXED_BG_COLOR,
                            touchAction: 'none',
                            width: `${TARGET_WIDTH_VW}vw`,
                            height: `${TARGET_HEIGHT_VH}vh`,
                        }}
                        className="rounded-md shadow-lg relative cursor-crosshair"
                        onMouseLeave={() => setCursorPosition({ x: -100, y: -100 })}
                    >
                        <canvas
                            ref={canvasRef}
                            className="block w-full h-full"
                            onMouseDown={startDrawing}
                            onMouseUp={stopDrawing}
                            onMouseMove={handleMouseMove}
                            onTouchStart={startDrawing}
                            onTouchEnd={stopDrawing}
                            onTouchMove={handleMouseMove}
                        />

                        {/* 4. Cursor Tẩy (Hiển thị khi dùng công cụ tẩy) */}
                        {currentTool === 'eraser' && (
                            <div
                                style={{
                                    width: lineThickness * 2 + 2,
                                    height: lineThickness * 2 + 2,
                                    left: cursorPosition.x,
                                    top: cursorPosition.y,
                                    display: cursorPosition.x === -100 ? 'none' : 'block',
                                }}
                                className="pointer-events-none absolute border-2 border-dashed border-gray-700 bg-gray-300/50 transform -translate-x-1/2 -translate-y-1/2 rounded-none"
                            />
                        )}
                    </div>

                    {/* 5. Pagination Control */}
                    <div className="flex items-center space-x-3 mt-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage === 0}
                            title="Trang trước"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>

                        <span className="text-sm font-semibold">
                            Trang {currentPage + 1} / {MAX_PAGES}
                        </span>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage === MAX_PAGES - 1}
                            title="Trang tiếp"
                        >
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Lớp Overlay (nền mờ) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default NoteCanvas;
