import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';

export function EmotionalAnchor() {
  return (
    <motion.div
      className="fixed top-4 right-4 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="relative group">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all duration-500" />
        
        {/* Main anchor */}
        <motion.div
          className="relative w-12 h-12 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {/* Rotating hexagon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          >
            <Hexagon 
              className="w-10 h-10 text-primary/60 stroke-1" 
              strokeWidth={1}
            />
          </motion.div>
          
          {/* Center dot - the true anchor */}
          <div className="absolute w-2 h-2 rounded-full bg-foreground/80" />
        </motion.div>

        {/* Tooltip */}
        <motion.div
          className="absolute right-0 top-full mt-2 px-3 py-1.5 rounded-lg bg-card text-xs text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ transformOrigin: 'top right' }}
        >
          Your anchor point
        </motion.div>
      </div>
    </motion.div>
  );
}
