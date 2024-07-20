import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const router = useRouter();
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      if (value) {
        router.push(`?q=${value}`);
      } else {
        router.push(`/`);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
