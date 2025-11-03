import React, { useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
interface StatisticProps {
  value: number;
  label: string;
  suffix?: string;
}
const Statistic: React.FC<StatisticProps> = ({
  value,
  label,
  suffix = ''
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px"
  });
  useEffect(() => {
    if (isInView && ref.current) {
      const node = ref.current;
      const controls = animate(0, value, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(latest) {
          node.textContent = Math.floor(latest).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
        }
      });
      return () => controls.stop();
    }
  }, [isInView, value, suffix]);
  return <div className="text-center p-6 rounded-2xl transition-all duration-300">
      <h3 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-lg">
        <span ref={ref}>0</span>
      </h3>
      <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">{label}</p>
    </div>;
};
const StatisticsCounter = () => {
  const stats = [{
    value: 10000,
    label: 'Alumni Network',
    suffix: '+'
  }, {
    value: 500,
    label: 'Mentorship Programs',
    suffix: '+'
  }, {
    value: 95,
    label: 'Success Rate',
    suffix: '%'
  }, {
    value: 200,
    label: 'Annual Events',
    suffix: '+'
  }];
  return <section className="relative py-20 bg-gradient-to-br from-background via-primary/10 to-secondary/10 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-primary/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-secondary/40 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="relative container mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{
        once: true,
        amount: 0.5
      }} transition={{
        staggerChildren: 0.2
      }} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => <motion.div key={index} variants={{
          hidden: {
            opacity: 0,
            y: 20
          },
          visible: {
            opacity: 1,
            y: 0
          }
        }} className="group">
              <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <Statistic {...stat} />
              </div>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
};
export default StatisticsCounter;