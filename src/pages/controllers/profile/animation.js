import { motion } from "framer-motion";


const animation_settings = {
    animate: {opacity: 3, y: -7}
};


const AnimatedSettings = ({ children }) => {
    return (
        <motion.div
            variants={animation_settings} 
            animate="animate" 
            transition={{ duration: 0.2 }}
        >
        {children}

        </motion.div>
    )
};


export default AnimatedSettings;