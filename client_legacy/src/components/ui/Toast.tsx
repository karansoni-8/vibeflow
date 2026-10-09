import React from 'react';
import toast, { Toaster as HotToaster } from 'react-hot-toast';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/cn';

export const Toaster = () => {
  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      }}
    />
  );
};

const ToastContent = ({ message, type, icon: Icon, colorClass }: { message: string, type: string, icon: any, colorClass: string }) => (
  <div className={cn(
    "flex items-center gap-3 px-4 py-3 bg-[#0b0f17]/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg overflow-hidden min-w-[300px]",
    colorClass
  )}>
    <div className="flex-shrink-0">
      <Icon size={20} />
    </div>
    <p className="text-sm font-medium text-slate-200">{message}</p>
  </div>
);

export const showSuccess = (message: string) => {
  toast.custom((t) => (
    <div className={cn("transition-all duration-300", t.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
      <ToastContent 
        message={message} 
        type="success" 
        icon={CheckCircle2} 
        colorClass="border-l-4 border-l-emerald-500 text-emerald-400" 
      />
    </div>
  ));
};

export const showError = (message: string) => {
  toast.custom((t) => (
    <div className={cn("transition-all duration-300", t.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
      <ToastContent 
        message={message} 
        type="error" 
        icon={AlertCircle} 
        colorClass="border-l-4 border-l-red-500 text-red-400" 
      />
    </div>
  ));
};

export const showInfo = (message: string) => {
  toast.custom((t) => (
    <div className={cn("transition-all duration-300", t.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
      <ToastContent 
        message={message} 
        type="info" 
        icon={Info} 
        colorClass="border-l-4 border-l-cyan-500 text-cyan-400" 
      />
    </div>
  ));
};
