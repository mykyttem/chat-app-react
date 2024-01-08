import { motion } from "framer-motion";


const animations = {
    animate: {opacity: 1, y: -7}
}

const Animated = ({ children }) => {
    return (
        <motion.div
            variants={animations} 
            animate="animate" 
            transition={{ duration: 0.5 }}
        >
        {children}

        </motion.div>
    )
}


export default Animated;