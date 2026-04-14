import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";

interface VirtualTourViewerProps {
  matterportId: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const VirtualTourViewer = ({ matterportId, isOpen, onClose, title }: VirtualTourViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" onClick={onClose} />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-[95vw] h-[90vh] max-w-[1600px] z-10"
          >
            {/* Header bar */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-background/80 to-transparent">
              <div>
                {title && (
                  <h3 className="font-display text-lg text-foreground">{title}</h3>
                )}
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary">
                  Visite virtuelle 3D — Matterport
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Fullscreen"
                >
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Matterport iframe */}
            <iframe
              src={`https://my.matterport.com/show/?m=${matterportId}&play=1&qs=1&brand=0&dh=1&gt=0`}
              title={title || "Visite virtuelle 3D"}
              className="w-full h-full border-0 rounded-sm"
              allow="fullscreen; vr; xr"
              allowFullScreen
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VirtualTourViewer;
