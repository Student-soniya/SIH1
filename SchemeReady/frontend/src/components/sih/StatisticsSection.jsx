import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Code2, Layers, Compass, TrendingUp, Sparkles } from 'lucide-react';

function CounterItem({ target, duration = 1500, label, subtitle, icon: Icon, color = 'text-orange-500' }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const stepTime = Math.abs(Math.floor(duration / target));
          const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            }
          }, stepTime);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, target, duration]);

  return (
    <div
      ref={elementRef}
      className="relative p-6 sm:p-8 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-md shadow-slate-950/5 hover:shadow-xl hover:border-orange-300 transition-all duration-300 group overflow-hidden"
    >
      {/* Subtle top indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:from-orange-500 group-hover:via-amber-400 group-hover:to-emerald-500 transition-all duration-500" />
      
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-mono">
            <span>{count}</span>
            <span className="text-orange-500 text-2xl sm:text-3xl ml-0.5">+</span>
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
            {label}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            {subtitle}
          </p>
        </div>

        <div className={`w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-orange-50 flex items-center justify-center transition-colors duration-300 ${color}`}>
          <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </div>
  );
}

export default function StatisticsSection() {
  const stats = [
    {
      target: 58,
      label: 'Hardware Problem Statements',
      subtitle: 'Robotics, IoT, Embedded & Defense Prototypes',
      icon: Cpu,
      color: 'text-orange-600'
    },
    {
      target: 182,
      label: 'Software Problem Statements',
      subtitle: 'AI/ML, FinTech, Cyber Security & Web Systems',
      icon: Code2,
      color: 'text-blue-600'
    },
    {
      target: 17,
      label: 'Hardware Themes',
      subtitle: 'Smart Vehicles, Medical Devices & Green Tech',
      icon: Layers,
      color: 'text-emerald-600'
    },
    {
      target: 17,
      label: 'Software Themes',
      subtitle: 'GovTech, Education, Smart Automation & Analytics',
      icon: Compass,
      color: 'text-amber-600'
    }
  ];

  return (
    <section className="relative -mt-10 z-30 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <CounterItem
            key={i}
            target={stat.target}
            label={stat.label}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
    </section>
  );
}