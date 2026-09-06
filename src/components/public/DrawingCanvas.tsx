import { useRef, useState, useEffect } from 'react';

type Point = { x: number; y: number };

export function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#818cf8');
  const [thickness, setThickness] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const lastPoint = useRef<Point | null>(null);

  const COLORS = ['#818cf8', '#22d3ee', '#f472b6', '#fbbf24', '#34d399', '#f4f4f5'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0c0c11';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setHistory((prev) => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    saveState();
    setIsDrawing(true);
    lastPoint.current = getPos(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);
    const last = lastPoint.current!;

    ctx.strokeStyle = isEraser ? '#0c0c11' : color;
    ctx.lineWidth = isEraser ? thickness * 4 : thickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPoint.current = pos;
  };

  const stopDraw = () => {
    setIsDrawing(false);
    lastPoint.current = null;
  };

  const handleClear = () => {
    saveState();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0c0c11';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const lastState = history[history.length - 1];
    ctx.putImageData(lastState, 0, 0);
    setHistory((prev) => prev.slice(0, -1));
  };

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#0c0c11]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500/80 animate-pulse" />
          <span className="text-xs font-mono text-zinc-500">CAMERA FEED — OPENCV ACTIVE</span>
        </div>
        <span className="text-xs font-mono text-green-500/70">REC</span>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={320}
          className="w-full block cursor-crosshair"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
        />
        <div className="absolute top-3 left-3 px-2 py-1 rounded glass text-[10px] font-mono text-zinc-500 pointer-events-none">
          MOVE CURSOR TO DRAW
        </div>
      </div>

      <div className="p-3 border-t border-white/5 bg-[#0c0c11] flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => { setColor(c); setIsEraser(false); }}
              className={`w-5 h-5 rounded-full border-2 transition-all ${
                color === c && !isEraser ? 'border-white scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs text-zinc-500 font-mono">SIZE</span>
          <input
            type="range"
            min={1}
            max={10}
            value={thickness}
            onChange={(e) => setThickness(parseInt(e.target.value))}
            className="w-20 accent-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors ${
              isEraser ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            ERASER
          </button>
          <button
            onClick={handleUndo}
            className="px-2.5 py-1 text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            UNDO
          </button>
          <button
            onClick={handleClear}
            className="px-2.5 py-1 text-xs font-mono text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            CLEAR
          </button>
        </div>
      </div>
    </div>
  );
}
