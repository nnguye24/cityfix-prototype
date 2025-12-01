import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Menu, 
  X, 
  Plus, 
  Home, 
  Bookmark, 
  ChevronLeft, 
  ChevronDown, 
  CheckCircle,
  Navigation
} from 'lucide-react';

// --- Mock Data ---
const issueOptions = [
  'Lights Issue',
  'Dirty Station',
  'Vandalism',
  'Turnstile Broken', 
  'Map/Signage Broken'
];

// --- Shared Components ---

// Bottom Navigation
const BottomNav = ({ active, setCurrentScreen }) => (
  <div className="absolute bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 p-4 pb-6 flex justify-around items-center z-20">
    <button 
      onClick={() => setCurrentScreen('map')}
      className={`flex flex-col items-center gap-1 ${active === 'home' ? 'text-blue-500' : 'text-slate-400'}`}
    >
      <Home size={24} />
    </button>
    <button className="flex flex-col items-center gap-1 text-slate-400">
      <Bookmark size={24} />
    </button>
    <button 
      onClick={() => setCurrentScreen('menu')}
      className={`flex flex-col items-center justify-center w-12 h-12 rounded-full shadow-lg transition-transform active:scale-95 ${
        active === 'plus' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
      }`}
    >
      <Plus size={28} />
    </button>
  </div>
);

// --- Screens (Defined outside App to prevent re-render bugs) ---

// 1. Map Screen
const MapScreen = ({ setCurrentScreen }) => (
  <div className="h-full w-full relative bg-slate-800 overflow-hidden">
    {/* Simulated Map Background */}
    <div className="absolute inset-0 opacity-40">
      <div className="absolute top-1/4 left-1/4 w-full h-2 bg-slate-600 -rotate-12"></div>
      <div className="absolute top-1/3 right-0 w-full h-4 bg-slate-600 rotate-45"></div>
      <div className="absolute bottom-1/3 left-0 w-2/3 h-3 bg-slate-600 rotate-12"></div>
      <div className="absolute top-0 left-1/2 w-4 h-full bg-slate-700/50"></div>
      {/* Map Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
         <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
         <div className="w-32 h-32 bg-blue-500/20 rounded-full -translate-x-14 -translate-y-14 animate-ping"></div>
      </div>
      <div className="absolute top-1/4 left-1/3 text-slate-500 flex flex-col items-center">
          <MapPin size={24} className="text-red-500" />
          <span className="text-xs font-bold bg-slate-900 px-1 rounded">Target</span>
      </div>
    </div>

    {/* Map UI Overlays */}
    <div className="absolute top-12 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-xl flex items-center gap-3">
      <Menu className="text-slate-400" />
      <div className="flex-1">
        <p className="text-white font-medium text-sm">Clark/Lake Station</p>
        <p className="text-slate-500 text-xs">Downtown Chicago Loop</p>
      </div>
      <Navigation className="text-blue-500 bg-blue-500/10 p-1 rounded-lg" size={28} />
    </div>

    <BottomNav active="home" setCurrentScreen={setCurrentScreen} />
  </div>
);

// 2. More Options Menu
const MenuScreen = ({ setCurrentScreen }) => (
  <div className="h-full w-full bg-slate-900/95 backdrop-blur-sm z-30 animate-in slide-in-from-bottom duration-300 relative flex flex-col">
     <div className="flex-1 px-6 pt-16">
        <h2 className="text-2xl font-bold text-white mb-8">More Options</h2>
        
        <div className="space-y-4">
           {['Traffic Settings', 'Share Location', 'Offline Maps'].map((item) => (
             <div key={item} className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-400">
               {item}
             </div>
           ))}
           
           {/* The Feature Button */}
           <button 
             onClick={() => setCurrentScreen('report')}
             className="w-full text-left p-4 rounded-xl bg-slate-800 border-l-4 border-l-blue-500 border-y border-r border-slate-700 text-white font-medium shadow-lg hover:bg-slate-750 active:scale-95 transition-all"
           >
             Report Issue ?
           </button>
           
           {['Settings', 'Help & Support'].map((item) => (
             <div key={item} className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-400">
               {item}
             </div>
           ))}
        </div>
     </div>
     <BottomNav active="plus" setCurrentScreen={setCurrentScreen} />
  </div>
);

// 3. Report Issue Screen
const ReportScreen = ({
  setCurrentScreen,
  selectedIssue, setSelectedIssue,
  otherText, setOtherText,
  showDropdown, setShowDropdown,
  isKeyboardOpen, setIsKeyboardOpen,
  isSubmitting, handleReportSubmit
}) => (
  <div className="h-full w-full bg-slate-950 flex flex-col animate-in slide-in-from-right duration-300">
    {/* Header */}
    <div className="pt-12 pb-4 px-4 border-b border-slate-800 flex items-center bg-slate-900">
      <button onClick={() => setCurrentScreen('menu')} className="p-2 text-slate-400 hover:text-white">
        <ChevronLeft size={24} />
      </button>
      <h2 className="text-lg font-bold text-white ml-2">Report Issue</h2>
    </div>

    <div className="p-6 flex-1 overflow-y-auto">
      {/* Issue Dropdown Field */}
      <label className="block text-slate-400 text-sm font-medium mb-2">Issue Type</label>
      <div className="relative mb-6">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-left text-white flex justify-between items-center"
        >
          {selectedIssue || "Select an issue..."}
          <ChevronDown size={20} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-full left-0 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            {issueOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setSelectedIssue(opt);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-3 text-slate-300 hover:bg-blue-600 hover:text-white border-b border-slate-700 last:border-0"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Other Text Input */}
      <label className="block text-slate-400 text-sm font-medium mb-2">Other Details</label>
      <textarea 
        value={otherText}
        onChange={(e) => setOtherText(e.target.value)}
        onFocus={() => setIsKeyboardOpen(true)}
        onBlur={() => setIsKeyboardOpen(false)}
        placeholder="Describe the issue..."
        className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
      />

      {/* Simulated Keyboard Toolbar (Optional visual cue) */}
      {isKeyboardOpen && (
        <div className="mt-2 flex justify-end">
          <button 
            onClick={() => setIsKeyboardOpen(false)} 
            className="text-xs text-blue-400 font-medium px-2 py-1 bg-slate-800 rounded"
          >
            Done
          </button>
        </div>
      )}
    </div>

    {/* Footer / Report Button */}
    <div className="p-6 border-t border-slate-800 bg-slate-900">
      <button
        onClick={handleReportSubmit}
        disabled={!selectedIssue && !otherText}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
          (!selectedIssue && !otherText)
            ? 'bg-slate-800 text-slate-600'
            : 'bg-white text-slate-900 hover:bg-slate-200'
        }`}
      >
        {isSubmitting ? 'Sending...' : 'Report'}
      </button>
    </div>
  </div>
);

// 4. Success / Confirmation Screen
const SuccessScreen = ({ resetFlow }) => (
  <div className="h-full w-full bg-slate-950/80 backdrop-blur-sm absolute inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
    <div className="bg-slate-900 border border-slate-700 w-full max-w-sm p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
         <CheckCircle size={32} className="text-green-500" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Issue Reported</h2>
      <p className="text-slate-400 mb-6">Thanks for helping keep Chicago moving.</p>
      <button 
        onClick={resetFlow}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors"
      >
        Ok
      </button>
    </div>
  </div>
);

const App = () => {
  // --- State ---
  const [currentScreen, setCurrentScreen] = useState('map'); // map, menu, report, success
  const [selectedIssue, setSelectedIssue] = useState('');
  const [otherText, setOtherText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Handlers ---
  const handleReportSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentScreen('success');
    }, 1200);
  };

  const resetFlow = () => {
    setCurrentScreen('map');
    setSelectedIssue('');
    setOtherText('');
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-black flex justify-center font-sans">
      <div className="w-full max-w-md bg-slate-950 h-screen relative shadow-2xl overflow-hidden">
        {currentScreen === 'map' && <MapScreen setCurrentScreen={setCurrentScreen} />}
        
        {currentScreen === 'menu' && <MenuScreen setCurrentScreen={setCurrentScreen} />}
        
        {currentScreen === 'report' && (
          <ReportScreen 
            setCurrentScreen={setCurrentScreen}
            selectedIssue={selectedIssue}
            setSelectedIssue={setSelectedIssue}
            otherText={otherText}
            setOtherText={setOtherText}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            isKeyboardOpen={isKeyboardOpen}
            setIsKeyboardOpen={setIsKeyboardOpen}
            isSubmitting={isSubmitting}
            handleReportSubmit={handleReportSubmit}
          />
        )}
        
        {currentScreen === 'success' && (
          <>
            <MapScreen setCurrentScreen={setCurrentScreen} /> 
            <SuccessScreen resetFlow={resetFlow} />
          </>
        )}
      </div>
    </div>
  );
};

export default App;