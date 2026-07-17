// src/utils/usePyodide.js
import { useState, useEffect, useRef } from "react";

export function usePyodide() {
  const [pyodide, setPyodide] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    async function loadPyodideAndPackages() {
      setLoading(true);
      const pyodideModule = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
      });
      if (isMounted.current) {
        setPyodide(pyodideModule);
        setLoading(false);
      }
    }

    loadPyodideAndPackages();

    return () => {
      isMounted.current = false;
    };
  }, []);

  return { pyodide, loading };
}
