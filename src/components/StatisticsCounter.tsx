import React, { useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Users, Calendar, Award, TrendingUp } from 'lucide-react';
interface StatisticProps {
  value: number;
  label: string;
  suffix?: string;
  icon: React.ReactNode;
}
const Statistic: React.FC<StatisticProps> = ({
  value,
  label,
  suffix = '',
  icon
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
  return <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-center mb-4">
        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <h3 className="text-5xl md:text-6xl font-bold text-primary mb-2">
        <span ref={ref}>0</span>
      </h3>
      <p className="text-sm md:text-base text-muted-foreground font-medium">{label}</p>
    </div>;
};
const StatisticsCounter = () => {
  const stats = [{
    value: 10000,
    label: 'Alumni Network',
    suffix: '+',
    icon: <Users className="h-7 w-7 text-primary" />
  }, {
    value: 500,
    label: 'Mentorship Programs',
    suffix: '+',
    icon: <Calendar className="h-7 w-7 text-primary" />
  }, {
    value: 95,
    label: 'Success Rate',
    suffix: '%',
    icon: <Award className="h-7 w-7 text-primary" />
  }, {
    value: 200,
    label: 'Annual Events',
    suffix: '+',
    icon: <TrendingUp className="h-7 w-7 text-primary" />
  }];
  return <section className="py-20 bg-gradient-subtle overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{
        once: true,
        amount: 0.5
      }} transition={{
        staggerChildren: 0.15
      }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => <motion.div key={index} variants={{
          hidden: {
            opacity: 0,
            y: 20
          },
          visible: {
            opacity: 1,
            y: 0
          }
        }}>
              <Statistic {...stat} />
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
};
export default StatisticsCounter;