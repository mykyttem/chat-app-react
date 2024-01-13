import { motion } from "framer-motion";


const animation_chat = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 }
};

const animation_message = {
  animate: {opacity: 1, y: -7}
};

const animation_menu = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
};


const Animated_chat = ({ children }) => {
    return (
        <motion.div
          variants={animation_chat}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.2 }}
        >
        {children}

        </motion.div>
    );
};


const AnimatedMessage = ({ children }) => {
    return (
        <motion.div
            variants={animation_message} 
            animate="animate" 
            transition={{ duration: 0.2 }}
        >
        {children}

        </motion.div>
    )
};


const Animated_menu = ({ children }) => {
    return (
      <motion.div
        variants={animation_menu}
        initial="initial" 
        animate="animate"
        transition={{ duration: 0.1 }}
      >
        {children}
      </motion.div>
    );
};


export { Animated_chat, AnimatedMessage, Animated_menu };