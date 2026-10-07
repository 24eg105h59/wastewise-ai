import React, { useState } from 'react';
import { UploadCloud, Camera, CheckCircle, AlertTriangle, AlertCircle, X, ShieldAlert, Cpu } from 'lucide-react';

const Scanner = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        simulateAnalysis(e.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const simulateAnalysis = async (imgDataUrl: string) => {
    setAnalyzing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/scans/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imageUrl: imgDataUrl })
      });
      const data = await res.json();
      if (data.analysis) {
        setResult(data.analysis);
        setQuantity(parseFloat(data.analysis.quantity) || 1);
      } else {
        alert('Analysis failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to AI Service');
    } finally {
      setAnalyzing(false);
    }
  };

  const addToInventory = async () => {
    if (!result) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: result.productName,
          brand: result.brand,
          quantity: quantity,
          unit: result.unit || 'units',
          expiryDate: result.expiryDate,
          riskLevel: result.riskLevel
        })
      });
      if (res.ok) {
        alert('Product added to inventory!');
        reset();
      } else {
        alert('Failed to add product.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error adding product.');
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setQuantity(1);
    setAnalyzing(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ScanLine className="text-primary" /> AI Food Scanner
        </h1>
        <p className="text-gray-500 mt-2">
          Take a photo of food or packaging. FoodGuard AI reads labels, tracks expiry dates, and detects visible risks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Image Input</h2>
            {image && (
              <button onClick={reset} className="text-gray-500 hover:text-red-500 flex items-center gap-1 text-sm font-medium">
                <X size={16} /> Clear
              </button>
            )}
          </div>
          
          {!image ? (
            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <UploadCloud className="text-primary w-8 h-8" />
              </div>
              <p className="font-semibold text-gray-700 text-lg">Click or drag image to upload</p>
              <p className="text-gray-500 text-sm mt-1">Supports JPG, PNG, WEBP</p>
              
              <div className="flex items-center gap-4 mt-8 w-full max-w-xs">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-400 text-sm font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <button className="mt-6 flex items-center gap-2 bg-white border border-gray-300 px-6 py-2 rounded-lg font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <Camera size={18} /> Use Camera
              </button>
            </div>
          ) : (
            <div className="flex-1 relative rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <img src={image} alt="Uploaded food" className="max-h-full max-w-full object-contain" />
              {analyzing && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-white font-medium text-lg flex items-center gap-2">
                    <Cpu className="text-primary" /> Analyzing with FoodGuard AI...
                  </p>
                  <div className="mt-6 space-y-2 w-64">
                    <div className="h-1 w-full bg-gray-700 rounded overflow-hidden">
                      <div className="h-full bg-primary animate-pulse w-3/4"></div>
                    </div>
                    <p className="text-xs text-center text-gray-400">Extracting OCR text & expiry dates</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-[500px] overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Analysis Results</h2>
          
          {!result && !analyzing && (
             <div className="flex flex-col items-center justify-center h-64 text-center">
               <ScanLine className="text-gray-300 w-16 h-16 mb-4" />
               <p className="text-gray-500 font-medium">Upload an image to see AI analysis results.</p>
             </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold uppercase">{result.category}</span>
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold uppercase flex items-center gap-1">
                      <ShieldAlert size={12} /> {result.riskLevel} RISK
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{result.productName}</h3>
                  <div className="text-gray-500 font-medium flex items-center gap-2 mt-2">
                    <span>{result.brand}</span>
                    <span>•</span>
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                      >-</button>
                      <input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-12 text-center py-1 outline-none font-bold"
                        min="1"
                      />
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                      >+</button>
                    </div>
                    <span>{result.unit}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Mfg Date</p>
                  <p className="font-medium">{result.manufacturingDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1">
                    Expiry Date <AlertTriangle size={14} className="text-orange-500" />
                  </p>
                  <p className="font-bold text-red-600">{result.expiryDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Batch</p>
                  <p className="font-medium">{result.batchNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Storage</p>
                  <p className="font-medium">{result.storageInstruction}</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                <h4 className="font-bold text-red-800 flex items-center gap-2 mb-2">
                  <AlertCircle size={18} /> Visible Concerns Detected
                </h4>
                <ul className="space-y-1">
                  {result.warnings.map((w: string, i: number) => (
                    <li key={i} className="text-red-700 text-sm flex items-start gap-2">
                      <span className="mt-1">•</span> {w}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-xs text-gray-500 border-t border-gray-100 pt-4 flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 text-gray-400" />
                <p>
                  <strong>Disclaimer:</strong> FoodGuard AI provides informational assistance based on images. 
                  Visual AI cannot confirm that food is safe to consume. Always follow applicable food-safety procedures 
                  and perform human inspection.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={addToInventory} className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors flex justify-center items-center gap-2">
                  <CheckCircle size={18} /> Add to Inventory
                </button>
                <button className="px-4 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Edit Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ScanLine icon definition inline to fix missing import since I forgot to import it from lucide-react above.
const ScanLine = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M7 12h10" />
  </svg>
);

export default Scanner;
