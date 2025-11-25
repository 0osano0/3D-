import React, { useRef, useState } from 'react';
import { ElementType } from '../types';

interface ToolbarProps {
  onAdd: (type: ElementType) => void;
  onClear: () => void;
  onExport: () => void;
  onUploadMap: (file: File) => void;
  onAnalyzeMap: () => void;
  onGenerateText: (prompt: string) => void;
  isAnalyzing: boolean;
  mapLoaded: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
    onAdd, 
    onClear, 
    onExport, 
    onUploadMap, 
    onAnalyzeMap,
    onGenerateText,
    isAnalyzing,
    mapLoaded
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState("");
  const [showPromptInput, setShowPromptInput] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadMap(e.target.files[0]);
    }
  };

  const categories = [
    { type: ElementType.BUILDING, label: '教学楼', icon: 'fa-building', color: 'bg-blue-600' },
    { type: ElementType.FIELD, label: '操场/空地', icon: 'fa-futbol', color: 'bg-green-600' },
    { type: ElementType.ROAD, label: '道路', icon: 'fa-road', color: 'bg-gray-600' },
    { type: ElementType.TREE, label: '绿化', icon: 'fa-tree', color: 'bg-emerald-500' },
  ];

  return (
    <div className="absolute top-0 left-0 h-full w-80 bg-gray-950/90 backdrop-blur-md border-r border-gray-800 p-4 flex flex-col gap-6 overflow-y-auto text-sm z-10 shadow-2xl">
      
      {/* Header */}
      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          <i className="fas fa-cube mr-2"></i>EduBuild 3D
        </h1>
        <p className="text-gray-400 text-xs mt-1">AI 驱动的校园规划建设系统</p>
      </div>

      {/* Satellite Map Section */}
      <div className="space-y-3">
        <h2 className="text-gray-300 font-semibold uppercase tracking-wider text-xs">1. 卫星地图 / 基地图</h2>
        
        <div className="grid grid-cols-1 gap-2">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 bg-gray-800 hover:bg-gray-700 rounded-md border border-gray-700 transition flex items-center justify-center gap-2"
            >
                <i className="fas fa-upload"></i> 上传卫星图
            </button>

            {mapLoaded && (
                 <button 
                 onClick={onAnalyzeMap}
                 disabled={isAnalyzing}
                 className={`w-full py-2 px-3 rounded-md border border-purple-500/50 transition flex items-center justify-center gap-2 ${isAnalyzing ? 'bg-purple-900/50 cursor-wait' : 'bg-purple-600 hover:bg-purple-500'}`}
             >
                 {isAnalyzing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
                 AI 识别生成模型
             </button>
            )}
        </div>
      </div>

       {/* AI Text Gen Section */}
       <div className="space-y-3">
        <h2 className="text-gray-300 font-semibold uppercase tracking-wider text-xs">2. AI 描述生成</h2>
        <div className="flex flex-col gap-2">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="例如：建一所现代中学，中间有一个大足球场，四周有三栋教学楼和一条环形道路..."
                className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:outline-none focus:border-blue-500 h-24 text-xs resize-none"
            />
            <button
                onClick={() => onGenerateText(prompt)}
                disabled={isAnalyzing || !prompt.trim()}
                 className={`w-full py-2 px-3 rounded-md transition flex items-center justify-center gap-2 ${isAnalyzing ? 'bg-blue-900/50' : 'bg-blue-600 hover:bg-blue-500'}`}
            >
                 {isAnalyzing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                 生成布局
            </button>
        </div>
      </div>

      {/* Manual Construction */}
      <div className="space-y-3 flex-1">
        <h2 className="text-gray-300 font-semibold uppercase tracking-wider text-xs">3. 手动建设 / 调整</h2>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.type}
              onClick={() => onAdd(cat.type)}
              className={`${cat.color} hover:opacity-90 py-3 rounded-md flex flex-col items-center justify-center gap-1 transition shadow-lg active:scale-95`}
            >
              <i className={`fas ${cat.icon} text-lg`}></i>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-gray-800 space-y-2">
        <button 
            onClick={onExport}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-md font-medium shadow-lg transition flex items-center justify-center gap-2"
        >
             <i className="fas fa-camera"></i> 导出 JPG 效果图
        </button>
        <button 
            onClick={onClear}
            className="w-full py-2 bg-red-900/50 hover:bg-red-800 rounded-md text-red-200 border border-red-900/50 transition flex items-center justify-center gap-2"
        >
            <i className="fas fa-trash"></i> 清空场景
        </button>
      </div>
    </div>
  );
};
