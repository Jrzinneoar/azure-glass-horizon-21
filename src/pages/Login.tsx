
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedBrush from '@/components/AnimatedBrush';
import { motion } from 'framer-motion';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      {/* Background brushes with enhanced animations */}
      <div className="absolute inset-0 z-0">
        <AnimatedBrush 
          color="rgba(149, 128, 255, 0.05)" 
          size={800} 
          className="top-[-300px] left-[-200px]" 
        />
        <AnimatedBrush 
          color="rgba(255, 255, 255, 0.03)" 
          size={600} 
          variant={2}
          className="bottom-[-200px] right-[-100px]" 
        />
        <AnimatedBrush 
          color="rgba(149, 128, 255, 0.03)" 
          size={500} 
          className="top-[30%] right-[-20%]" 
        />
      </div>
      
      <motion.div 
        className="z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="glass-morphism p-8 sm:p-10 rounded-3xl max-w-md w-full shadow-[0_10px_50px_rgba(149,128,255,0.2)]"
          variants={itemVariants}
          whileHover={{ 
            boxShadow: '0 15px 60px rgba(149,128,255,0.3)',
            borderColor: 'rgba(255,255,255,0.25)',
            y: -5
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.5
            }}
            className="mb-8 flex justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5865F2] to-[#7289da] flex items-center justify-center shadow-lg">
              <svg width="36" height="36" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0)">
                  <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="#ffffff"/>
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="71" height="55" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </motion.div>
        
          <motion.h1 
            className="text-4xl font-bold mb-3 bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent text-center"
            variants={itemVariants}
          >
            Azure Monitor
          </motion.h1>
          
          <motion.p 
            className="text-muted-foreground mb-8 text-center"
            variants={itemVariants}
          >
            Monitor and manage your Azure virtual machines with our intuitive dashboard
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <Button 
              onClick={login} 
              size="lg"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="w-full relative overflow-hidden group bg-[#5865F2] hover:bg-[#4752c4] transition-all duration-300"
            >
              {/* Animated shine effect */}
              <div className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 translate-x-[-100%] group-hover:animate-[shimmer_2s_ease_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </div>
              
              <div className="relative flex items-center justify-center gap-3">
                <svg width="24" height="24" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                  <g clipPath="url(#clip0)">
                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="#ffffff"/>
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect width="71" height="55" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                Login with Discord
              </div>
            </Button>
          </motion.div>
          
          <motion.p 
            className="mt-6 text-xs text-muted-foreground text-center"
            variants={itemVariants}
          >
            Secure authentication powered by Discord OAuth2
          </motion.p>
          
          {/* Decorative elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
            <div className="absolute top-2 left-2 w-5 h-5 rounded-br-lg border-b border-r border-white/20"></div>
            <div className="absolute top-2 right-2 w-5 h-5 rounded-bl-lg border-b border-l border-white/20"></div>
            <div className="absolute bottom-2 left-2 w-5 h-5 rounded-tr-lg border-t border-r border-white/20"></div>
            <div className="absolute bottom-2 right-2 w-5 h-5 rounded-tl-lg border-t border-l border-white/20"></div>
          </div>
        </motion.div>
        
        <motion.div
          className="mt-6 text-center text-sm text-white/50"
          variants={itemVariants}
        >
          © {new Date().getFullYear()} Azure Monitor • All Rights Reserved
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
