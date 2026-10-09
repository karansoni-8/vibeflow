import { useEffect, useRef } from 'react';
import { useIdeStore } from '../store/ideStore';
import { aiApi } from '../lib/api';

export function useDebouncedFlowchart() {
  const {
    code,
    language,
    autoSyncFlowchart,
    isGeneratingFlowchart,
    setFlowchartCode,
    setIsGeneratingFlowchart,
    setFlowchartError,
  } = useIdeStore();

  const lastGeneratedCodeRef = useRef<string>('');
  const timerRef = useRef<any>(null);

  const fetchFlowchart = async (currentCode: string, currentLang: string) => {
    if (!currentCode.trim() || currentCode === lastGeneratedCodeRef.current) {
      return;
    }

    try {
      setIsGeneratingFlowchart(true);
      setFlowchartError(null);
      const res = await aiApi.getFlowchart(currentCode, currentLang);
      if (res.mermaidCode) {
        setFlowchartCode(res.mermaidCode);
        lastGeneratedCodeRef.current = currentCode;
      }
    } catch (err: any) {
      console.warn('Flowchart generation failure:', err);
      setFlowchartError(err.message || 'Could not parse code into a flowchart.');
    } finally {
      setIsGeneratingFlowchart(false);
    }
  };

  // Debounced auto-sync trigger
  useEffect(() => {
    if (!autoSyncFlowchart) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      fetchFlowchart(code, language);
    }, 1300);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [code, language, autoSyncFlowchart]);

  const forceRegenerate = () => {
    fetchFlowchart(code, language);
  };

  return { forceRegenerate, isGeneratingFlowchart };
}
