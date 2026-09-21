import {
  lazy,
  Suspense,
  useMemo,
  type ComponentType,
  type ReactNode,
} from "react";
import { ClientOnly } from "@/components/meow/ClientOnly";
import { cn, hasWebGL } from "@/lib/utils";

interface WebGLFrameProps {
  importer: () => Promise<{ default: ComponentType }>
  fallback: ReactNode
  className?: string
}

export function WebGLFrame({ importer, fallback, className }: WebGLFrameProps) {
  const Scene = useMemo(() => lazy(importer), [importer]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <ClientOnly fallback={fallback}>
        {hasWebGL() ? (
          <Suspense fallback={fallback}>
            <div className="absolute inset-0">{fallback}</div>
            <div className="absolute inset-0">
              <Scene />
            </div>
          </Suspense>
        ) : (
          fallback
        )}
      </ClientOnly>
    </div>
  );
}
