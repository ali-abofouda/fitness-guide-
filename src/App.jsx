import { useState, useEffect, useRef, useMemo } from 'react';
import {
  ShieldCheck, HeartPulse, Zap, Timer, Flame, Snowflake,
  Activity, Dumbbell, StretchHorizontal, UserRound,
  BriefcaseMedical, BarChart3, Sparkles, ChevronDown,
  ChevronLeft, ChevronRight, Clock, Lightbulb, ArrowDown,
  Droplets, Target, MapPin, CalendarDays, Ruler, Weight,
  TrendingUp, Brain, CheckCircle2, CircleDot, Home, Medal,
} from 'lucide-react';
import './App.css';

/* ═══════════════════════════════════════════════════════════════
   EXERCISE DATABASE — 40+ exercises with sets/reps & metadata
   ═══════════════════════════════════════════════════════════════ */
const EXERCISE_DB = [
  // ── PUSH (Chest, Shoulders, Triceps) ──
  { id: 1,  name: 'تمارين الضغط', instructions: 'ضع يديك بعرض الكتفين على الأرض، انزل ببطء ثم ادفع للأعلى.', sets: 3, reps: '12-15', muscleGroups: ['chest', 'triceps', 'shoulders'], split: 'push', location: 'both', intensity: 5, impactLevel: 'Low', contraindications: ['Shoulder'], minAge: 14, maxAge: 60 },
  { id: 2,  name: 'بنش بريس بالبار', instructions: 'استلقِ على المقعد، أنزل البار لصدرك ثم ادفعه للأعلى بتحكم.', sets: 4, reps: '8-10', muscleGroups: ['chest', 'triceps'], split: 'push', location: 'gym', intensity: 7, impactLevel: 'Low', contraindications: ['Shoulder'], minAge: 16, maxAge: 55 },
  { id: 3,  name: 'ضغط دمبل مائل', instructions: 'على مقعد مائل 30°، ادفع الدمبلز للأعلى مع التقريب في القمة.', sets: 3, reps: '10-12', muscleGroups: ['chest', 'shoulders'], split: 'push', location: 'gym', intensity: 6, impactLevel: 'Low', contraindications: ['Shoulder'], minAge: 16, maxAge: 55 },
  { id: 4,  name: 'ضغط كتف بالدمبل', instructions: 'اجلس مستقيماً وارفع الدمبلز فوق رأسك ثم أنزلها بتحكم.', sets: 3, reps: '10-12', muscleGroups: ['shoulders', 'triceps'], split: 'push', location: 'both', intensity: 6, impactLevel: 'Low', contraindications: ['Shoulder'], minAge: 16, maxAge: 55 },
  { id: 5,  name: 'رفع جانبي', instructions: 'ارفع الدمبلز جانبياً حتى مستوى الكتف ثم أنزلها ببطء.', sets: 3, reps: '12-15', muscleGroups: ['shoulders'], split: 'push', location: 'both', intensity: 4, impactLevel: 'Low', contraindications: ['Shoulder'], minAge: 14, maxAge: 65 },
  { id: 6,  name: 'تمديد ترايسبس', instructions: 'أمسك الدمبل خلف رأسك ومدّ ذراعيك للأعلى.', sets: 3, reps: '12-15', muscleGroups: ['triceps'], split: 'push', location: 'both', intensity: 4, impactLevel: 'Low', contraindications: [], minAge: 14, maxAge: 65 },
  { id: 7,  name: 'تمارين المتوازي (ديبس)', instructions: 'أمسك المتوازي وانزل بجسمك ثم ادفع للأعلى.', sets: 3, reps: '8-12', muscleGroups: ['chest', 'triceps'], split: 'push', location: 'both', intensity: 7, impactLevel: 'Low', contraindications: ['Shoulder'], minAge: 16, maxAge: 50 },

  // ── PULL (Back, Biceps) ──
  { id: 8,  name: 'سحب كابل أمامي', instructions: 'اسحب الكابل نحو صدرك مع الحفاظ على استقامة الظهر.', sets: 4, reps: '10-12', muscleGroups: ['back', 'biceps'], split: 'pull', location: 'gym', intensity: 5, impactLevel: 'Low', contraindications: [], minAge: 14, maxAge: 65 },
  { id: 9,  name: 'تجديف بالدمبل', instructions: 'انحنِ للأمام واسحب الدمبل نحو خصرك ثم أنزله ببطء.', sets: 3, reps: '10-12', muscleGroups: ['back', 'biceps'], split: 'pull', location: 'both', intensity: 5, impactLevel: 'Low', contraindications: ['Back'], minAge: 14, maxAge: 60 },
  { id: 10, name: 'سحب أرضي (ديدليفت رومانى)', instructions: 'أمسك البار بقبضة عريضة، انحنِ من الورك مع ظهر مستقيم.', sets: 3, reps: '8-10', muscleGroups: ['back', 'hamstrings'], split: 'pull', location: 'gym', intensity: 8, impactLevel: 'High', contraindications: ['Back', 'Knee'], minAge: 18, maxAge: 50 },
  { id: 11, name: 'كيرل بايسبس', instructions: 'أمسك الدمبل وثبّت مرفقيك، ارفع الوزن بالتناوب.', sets: 3, reps: '12-15', muscleGroups: ['biceps'], split: 'pull', location: 'both', intensity: 3, impactLevel: 'Low', contraindications: [], minAge: 14, maxAge: 70 },
  { id: 12, name: 'كيرل مطرقة', instructions: 'أمسك الدمبل بقبضة محايدة وارفعه بدون لف المعصم.', sets: 3, reps: '12-15', muscleGroups: ['biceps', 'forearms'], split: 'pull', location: 'both', intensity: 3, impactLevel: 'Low', contraindications: [], minAge: 14, maxAge: 70 },
  { id: 13, name: 'سحب وجه (Face Pull)', instructions: 'اسحب الحبل نحو وجهك مع فتح المرفقين جانبياً.', sets: 3, reps: '15-20', muscleGroups: ['shoulders', 'back'], split: 'pull', location: 'gym', intensity: 3, impactLevel: 'Low', contraindications: [], minAge: 14, maxAge: 70 },
  { id: 14, name: 'عقلة (Pull-ups)', instructions: 'تعلّق بالبار واسحب جسمك حتى يتجاوز ذقنك البار.', sets: 3, reps: '6-10', muscleGroups: ['back', 'biceps'], split: 'pull', location: 'both', intensity: 8, impactLevel: 'Low', contraindications: ['Shoulder'], minAge: 16, maxAge: 50 },

  // ── LEGS (Quads, Hamstrings, Glutes, Calves) ──
  { id: 15, name: 'سكوات بوزن الجسم', instructions: 'قف بعرض الكتفين، انزل كأنك تجلس ثم قف. حافظ على استقامة الظهر.', sets: 3, reps: '15-20', muscleGroups: ['quads', 'glutes'], split: 'legs', location: 'both', intensity: 4, impactLevel: 'High', contraindications: ['Knee'], minAge: 12, maxAge: 70 },
  { id: 16, name: 'سكوات بالبار', instructions: 'ضع البار على كتفيك، انزل حتى يوازي فخذاك الأرض ثم قف.', sets: 4, reps: '8-10', muscleGroups: ['quads', 'glutes', 'core'], split: 'legs', location: 'gym', intensity: 8, impactLevel: 'High', contraindications: ['Knee', 'Back'], minAge: 16, maxAge: 50 },
  { id: 17, name: 'طعنات (لانجز)', instructions: 'اخطُ للأمام وانزل حتى 90 درجة ثم ادفع للعودة.', sets: 3, reps: '10 لكل ساق', muscleGroups: ['quads', 'glutes'], split: 'legs', location: 'both', intensity: 5, impactLevel: 'High', contraindications: ['Knee'], minAge: 14, maxAge: 60 },
  { id: 18, name: 'تمديد ساق (Leg Extension)', instructions: 'اجلس على الجهاز ومدّ ساقيك بالكامل ثم أنزل ببطء.', sets: 3, reps: '12-15', muscleGroups: ['quads'], split: 'legs', location: 'gym', intensity: 4, impactLevel: 'Low', contraindications: ['Knee'], minAge: 14, maxAge: 65 },
  { id: 19, name: 'ثني ساق (Leg Curl)', instructions: 'استلقِ على الجهاز واثنِ ساقيك نحو المؤخرة ثم أنزل ببطء.', sets: 3, reps: '12-15', muscleGroups: ['hamstrings'], split: 'legs', location: 'gym', intensity: 4, impactLevel: 'Low', contraindications: [], minAge: 14, maxAge: 65 },
  { id: 20, name: 'جسر الورك (Hip Thrust)', instructions: 'استند بأعلى ظهرك على المقعد، ارفع وركيك مع شد المؤخرة.', sets: 3, reps: '12-15', muscleGroups: ['glutes', 'hamstrings'], split: 'legs', location: 'both', intensity: 5, impactLevel: 'Low', contraindications: [], minAge: 14, maxAge: 65 },
  { id: 21, name: 'رفع سمانة', instructions: 'قف على حافة درجة وارفع كعبيك للأعلى ثم أنزل ببطء.', sets: 4, reps: '15-20', muscleGroups: ['calves'], split: 'legs', location: 'both', intensity: 3, impactLevel: 'Low', contraindications: [], minAge: 12, maxAge: 75 },

  // ── CORE ──
  { id: 22, name: 'بلانك', instructions: 'ارتكز على ساعديك وأصابع قدميك، حافظ على استقامة الجسم.', sets: 3, reps: '30-60 ث', muscleGroups: ['core'], split: 'core', location: 'both', intensity: 4, impactLevel: 'Low', contraindications: [], minAge: 10, maxAge: 75 },
  { id: 23, name: 'كرنشز', instructions: 'استلقِ على ظهرك واثنِ ركبتيك، ارفع كتفيك عن الأرض.', sets: 3, reps: '15-20', muscleGroups: ['core'], split: 'core', location: 'both', intensity: 3, impactLevel: 'Low', contraindications: ['Back'], minAge: 12, maxAge: 70 },
  { id: 24, name: 'رفع أرجل', instructions: 'استلقِ على ظهرك وارفع ساقيك مستقيمتين حتى 90 درجة.', sets: 3, reps: '12-15', muscleGroups: ['core'], split: 'core', location: 'both', intensity: 5, impactLevel: 'Low', contraindications: ['Back'], minAge: 14, maxAge: 60 },
  { id: 25, name: 'دراجة هوائية (Bicycle Crunch)', instructions: 'استلقِ وحرّك ساقيك كأنك تركب دراجة مع لف الجذع.', sets: 3, reps: '20 لكل جانب', muscleGroups: ['core'], split: 'core', location: 'both', intensity: 4, impactLevel: 'Low', contraindications: ['Back'], minAge: 14, maxAge: 65 },
  { id: 26, name: 'بلانك جانبي', instructions: 'ارتكز على ساعد واحد وحافظ على استقامة الجسم جانبياً.', sets: 3, reps: '20-30 ث لكل جانب', muscleGroups: ['core', 'shoulders'], split: 'core', location: 'both', intensity: 4, impactLevel: 'Low', contraindications: ['Shoulder'], minAge: 14, maxAge: 65 },

  // ── CARDIO ──
  { id: 27, name: 'المشي السريع', instructions: 'امشِ بخطوات سريعة مع تحريك الذراعين والحفاظ على استقامة الظهر.', sets: 1, reps: '20-30 د', muscleGroups: ['cardio'], split: 'cardio', location: 'both', intensity: 3, impactLevel: 'Low', contraindications: [], minAge: 5, maxAge: 100 },
  { id: 28, name: 'الجري', instructions: 'اجرِ بوتيرة متوسطة مع تنفس منتظم وخطوات ثابتة.', sets: 1, reps: '15-25 د', muscleGroups: ['cardio'], split: 'cardio', location: 'both', intensity: 6, impactLevel: 'High', contraindications: ['Knee', 'Back'], minAge: 14, maxAge: 55 },
  { id: 29, name: 'نط الحبل', instructions: 'انط بوتيرة متوسطة. تمرين ممتاز لحرق الدهون والتناسق.', sets: 3, reps: '60 ث', muscleGroups: ['cardio', 'calves'], split: 'cardio', location: 'both', intensity: 7, impactLevel: 'High', contraindications: ['Knee'], minAge: 12, maxAge: 50 },
  { id: 30, name: 'دراجة ثابتة', instructions: 'اركب الدراجة بمقاومة متوسطة لتحسين لياقة القلب.', sets: 1, reps: '20-30 د', muscleGroups: ['cardio', 'quads'], split: 'cardio', location: 'gym', intensity: 4, impactLevel: 'Low', contraindications: [], minAge: 10, maxAge: 80 },
  { id: 31, name: 'بيربي', instructions: 'اقفز للأعلى، انزل لوضعية الضغط، ثم اقفز مجدداً.', sets: 3, reps: '8-12', muscleGroups: ['cardio', 'chest', 'quads'], split: 'cardio', location: 'both', intensity: 9, impactLevel: 'High', contraindications: ['Knee', 'Back', 'Shoulder'], minAge: 16, maxAge: 45 },
  { id: 32, name: 'تسلّق الجبل (Mountain Climber)', instructions: 'في وضعية الضغط، اسحب ركبتيك بالتناوب نحو صدرك بسرعة.', sets: 3, reps: '30 ث', muscleGroups: ['cardio', 'core'], split: 'cardio', location: 'both', intensity: 7, impactLevel: 'Low', contraindications: [], minAge: 14, maxAge: 55 },
  { id: 33, name: 'صعود الدرج', instructions: 'اصعد وانزل الدرج أو استخدم جهاز الستيبر.', sets: 1, reps: '10-15 د', muscleGroups: ['cardio', 'quads', 'glutes'], split: 'cardio', location: 'both', intensity: 6, impactLevel: 'High', contraindications: ['Knee'], minAge: 14, maxAge: 60 },

  // ── FLEXIBILITY ──
  { id: 34, name: 'تمدد شامل', instructions: 'مدّد جميع عضلات الجسم ببطء، 20 ثانية لكل وضعية.', sets: 1, reps: '15-20 د', muscleGroups: ['flexibility'], split: 'flexibility', location: 'both', intensity: 2, impactLevel: 'Low', contraindications: [], minAge: 5, maxAge: 100 },
  { id: 35, name: 'يوغا أساسية', instructions: 'مارس أوضاع اليوغا الأساسية مع التركيز على التنفس العميق.', sets: 1, reps: '20-30 د', muscleGroups: ['flexibility', 'core'], split: 'flexibility', location: 'both', intensity: 3, impactLevel: 'Low', contraindications: [], minAge: 10, maxAge: 90 },
  { id: 36, name: 'إطالة الظهر', instructions: 'استلقِ واسحب ركبتيك نحو صدرك ببطء. استمر 20 ثانية.', sets: 1, reps: '5 تكرارات', muscleGroups: ['flexibility', 'back'], split: 'flexibility', location: 'both', intensity: 2, impactLevel: 'Low', contraindications: [], minAge: 10, maxAge: 100 },
  { id: 37, name: 'تمارين التوازن', instructions: 'قف على قدم واحدة 30 ثانية ثم بدّل. كرر 5 مرات.', sets: 1, reps: '5 لكل قدم', muscleGroups: ['flexibility', 'core'], split: 'flexibility', location: 'both', intensity: 2, impactLevel: 'Low', contraindications: [], minAge: 10, maxAge: 90 },
  { id: 38, name: 'فوم رولر', instructions: 'استخدم الأسطوانة لتدليك العضلات المشدودة ببطء.', sets: 1, reps: '10-15 د', muscleGroups: ['flexibility'], split: 'flexibility', location: 'both', intensity: 2, impactLevel: 'Low', contraindications: [], minAge: 14, maxAge: 80 },
  // ── EXTRA COMPOUND ──
  { id: 39, name: 'سحب أرضي كلاسيكي', instructions: 'أمسك البار، اثنِ ركبتيك، ارفع بظهر مستقيم.', sets: 4, reps: '5-8', muscleGroups: ['back', 'hamstrings', 'glutes', 'core'], split: 'pull', location: 'gym', intensity: 9, impactLevel: 'High', contraindications: ['Back', 'Knee'], minAge: 18, maxAge: 50 },
  { id: 40, name: 'ضغط أرضي بالدمبل', instructions: 'استلقِ على الأرض وادفع الدمبلز للأعلى. نطاق حركة آمن.', sets: 3, reps: '10-12', muscleGroups: ['chest', 'triceps'], split: 'push', location: 'both', intensity: 5, impactLevel: 'Low', contraindications: [], minAge: 14, maxAge: 65 },
  { id: 41, name: 'سوبرمان', instructions: 'استلقِ على بطنك وارفع ذراعيك وساقيك معاً. استمر 3 ثوانٍ.', sets: 3, reps: '12-15', muscleGroups: ['back', 'core'], split: 'pull', location: 'both', intensity: 3, impactLevel: 'Low', contraindications: [], minAge: 10, maxAge: 75 },
  { id: 42, name: 'تمرين الضغط الماسي', instructions: 'ضع يديك بشكل ماسي تحت صدرك وادفع للأعلى.', sets: 3, reps: '8-12', muscleGroups: ['triceps', 'chest'], split: 'push', location: 'both', intensity: 6, impactLevel: 'Low', contraindications: ['Shoulder'], minAge: 16, maxAge: 55 },
];

/* ═══════════════════════════════════════════════════════════════
   WARM-UP & COOL-DOWN — always included
   ═══════════════════════════════════════════════════════════════ */
const WARMUP = [
  { name: 'دوران الرقبة', dur: '1 د', desc: 'أدِر رقبتك ببطء في كل اتجاه 10 مرات.' },
  { name: 'دوران الكتفين', dur: '1 د', desc: 'أدِر كتفيك للأمام ثم للخلف 15 مرة.' },
  { name: 'دوران الوركين', dur: '1 د', desc: 'ضع يديك على خصرك وأدِر وركيك في دوائر.' },
  { name: 'المشي في المكان', dur: '2 د', desc: 'امشِ في مكانك مع رفع الركبتين تدريجياً.' },
  { name: 'تمدد ديناميكي', dur: '2 د', desc: 'ارفع كل ساق للأمام بالتناوب مع أرجحة خفيفة.' },
];
const COOLDOWN = [
  { name: 'المشي البطيء', dur: '2 د', desc: 'امشِ ببطء لتخفيض معدل ضربات القلب.' },
  { name: 'إطالة الفخذ', dur: '1 د', desc: 'أمسك قدمك خلفك واسحبها نحو المؤخرة.' },
  { name: 'إطالة أوتار الركبة', dur: '1 د', desc: 'مد ساقك وانحنِ نحو أصابع قدميك.' },
  { name: 'إطالة الكتف والصدر', dur: '1 د', desc: 'شبّك يديك خلف ظهرك وافتح صدرك.' },
  { name: 'تنفس عميق', dur: '2 د', desc: 'شهيق 4 ث، احبس 4 ث، زفير 6 ث.' },
];

/* ═══════════════════════════════════════════════════════════════
   LABELS (Arabic)
   ═══════════════════════════════════════════════════════════════ */
const GENDER_OPTS    = [{ v: 'male', l: 'ذكر' }, { v: 'female', l: 'أنثى' }];
const ACTIVITY_OPTS  = [{ v: 'sedentary', l: 'قليل الحركة' }, { v: 'active', l: 'نشيط' }, { v: 'athlete', l: 'رياضي' }];
const INJURY_OPTS    = [{ v: 'None', l: 'لا يوجد' }, { v: 'Knee', l: 'الركبة' }, { v: 'Back', l: 'الظهر' }, { v: 'Shoulder', l: 'الكتف' }];
const GOAL_OPTS      = [{ v: 'lose', l: 'خسارة الوزن' }, { v: 'gain', l: 'بناء العضلات' }, { v: 'endurance', l: 'تحسين التحمل' }];
const LOCATION_OPTS  = [{ v: 'gym', l: 'نادي رياضي' }, { v: 'home', l: 'المنزل' }];
const DAYS_OPTS      = [3, 4, 5, 6];

const SPLIT_LABELS = {
  push: 'دفع (صدر · كتف · ترايسبس)',
  pull: 'سحب (ظهر · بايسبس)',
  legs: 'أرجل (فخذ · مؤخرة · سمانة)',
  upper: 'الجزء العلوي',
  lower: 'الجزء السفلي',
  full: 'جسم كامل',
  cardio: 'تمارين القلب',
  core: 'تمارين البطن',
  flexibility: 'مرونة واستشفاء',
};

const SPLIT_ICONS = {
  push: Dumbbell, pull: Activity, legs: TrendingUp, upper: Dumbbell,
  lower: TrendingUp, full: Flame, cardio: HeartPulse, core: Target,
  flexibility: StretchHorizontal,
};

const BMI_CATEGORIES = [
  { max: 18.5, label: 'نقص الوزن', color: '#38bdf8', emoji: '🔵' },
  { max: 25,   label: 'وزن صحي',   color: '#22c55e', emoji: '🟢' },
  { max: 30,   label: 'وزن زائد',   color: '#eab308', emoji: '🟡' },
  { max: Infinity, label: 'سمنة',   color: '#ef4444', emoji: '🔴' },
];

/* ═══════════════════════════════════════════════════════════════
   CALCULATORS
   ═══════════════════════════════════════════════════════════════ */
function calcBMI(weight, heightCm) {
  const h = heightCm / 100;
  return weight / (h * h);
}

function getBMICategory(bmi) {
  return BMI_CATEGORIES.find((c) => bmi < c.max) || BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
}

function calcBMR(gender, weight, heightCm, age) {
  // Mifflin-St Jeor
  if (gender === 'male')   return 10 * weight + 6.25 * heightCm - 5 * age + 5;
  return 10 * weight + 6.25 * heightCm - 5 * age - 161;
}

function calcTDEE(bmr, activity) {
  const mult = { sedentary: 1.4, active: 1.6, athlete: 1.85 };
  return bmr * (mult[activity] || 1.5);
}

function goalCalories(tdee, goal) {
  if (goal === 'lose') return Math.round(tdee - 500);
  if (goal === 'gain') return Math.round(tdee + 350);
  return Math.round(tdee);
}

function waterIntake(weight) {
  return Math.round(weight * 0.033 * 10) / 10; // liters
}

/* ═══════════════════════════════════════════════════════════════
   WORKOUT SPLIT GENERATOR
   ═══════════════════════════════════════════════════════════════ */
function getSplitTemplate(days) {
  switch (days) {
    case 3: return [
      { day: 'اليوم 1', type: 'full', label: 'جسم كامل A' },
      { day: 'اليوم 2', type: 'full', label: 'جسم كامل B' },
      { day: 'اليوم 3', type: 'full', label: 'جسم كامل C + كارديو' },
    ];
    case 4: return [
      { day: 'اليوم 1', type: 'upper', label: 'علوي (قوة)' },
      { day: 'اليوم 2', type: 'lower', label: 'سفلي (قوة)' },
      { day: 'اليوم 3', type: 'upper', label: 'علوي (حجم)' },
      { day: 'اليوم 4', type: 'lower', label: 'سفلي (حجم) + كارديو' },
    ];
    case 5: return [
      { day: 'اليوم 1', type: 'push', label: 'دفع' },
      { day: 'اليوم 2', type: 'pull', label: 'سحب' },
      { day: 'اليوم 3', type: 'legs', label: 'أرجل' },
      { day: 'اليوم 4', type: 'upper', label: 'علوي + بطن' },
      { day: 'اليوم 5', type: 'lower', label: 'سفلي + كارديو' },
    ];
    case 6: return [
      { day: 'اليوم 1', type: 'push', label: 'دفع' },
      { day: 'اليوم 2', type: 'pull', label: 'سحب' },
      { day: 'اليوم 3', type: 'legs', label: 'أرجل' },
      { day: 'اليوم 4', type: 'push', label: 'دفع (حجم)' },
      { day: 'اليوم 5', type: 'pull', label: 'سحب (حجم)' },
      { day: 'اليوم 6', type: 'legs', label: 'أرجل + كارديو' },
    ];
    default: return [];
  }
}

/* Map split type → what exercise splits to pick from */
const TYPE_MAP = {
  push: ['push'],
  pull: ['pull'],
  legs: ['legs'],
  upper: ['push', 'pull'],
  lower: ['legs'],
  full: ['push', 'pull', 'legs'],
};

function generateSchedule(template, { age, injury, location, goal }) {
  return template.map((slot, slotIdx) => {
    const splitTypes = TYPE_MAP[slot.type] || ['push', 'pull', 'legs'];

    // Filter safe exercises
    let pool = EXERCISE_DB.filter((ex) => {
      if (!splitTypes.includes(ex.split) && ex.split !== 'core' && ex.split !== 'cardio') return false;
      if (injury !== 'None' && ex.contraindications.includes(injury)) return false;
      if (age < ex.minAge || age > ex.maxAge) return false;
      if (location === 'home' && ex.location === 'gym') return false;
      return true;
    });

    // Build the day's workout
    const dayExercises = [];
    const usedIds = new Set();

    // Pick main exercises from each split type
    for (const st of splitTypes) {
      const candidates = pool
        .filter((ex) => ex.split === st && !usedIds.has(ex.id))
        .sort((a, b) => b.intensity - a.intensity);
      const pick = candidates.slice(0, slot.type === 'full' ? 2 : 3);
      pick.forEach((ex) => { dayExercises.push(ex); usedIds.add(ex.id); });
    }

    // Add 1-2 core exercises
    const coreCandidates = pool.filter((ex) => ex.split === 'core' && !usedIds.has(ex.id));
    const coreCount = slot.type === 'full' ? 1 : 2;
    coreCandidates.slice(0, coreCount).forEach((ex) => { dayExercises.push(ex); usedIds.add(ex.id); });

    // Add cardio if slot label mentions it or goal is endurance/lose
    const needsCardio = slot.label.includes('كارديو') || goal === 'endurance' || goal === 'lose';
    if (needsCardio) {
      const cardioCandidates = pool.filter((ex) => ex.split === 'cardio' && !usedIds.has(ex.id));
      if (cardioCandidates.length > 0) {
        // Pick one based on slotIdx to vary
        const c = cardioCandidates[slotIdx % cardioCandidates.length];
        dayExercises.push(c);
        usedIds.add(c.id);
      }
    }

    return { ...slot, exercises: dayExercises };
  });
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* ── Progress Bar ── */
function WizardProgress({ step, total }) {
  return (
    <div className="wizard-progress">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`progress-step ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
          <div className="step-circle">
            {i < step ? <CheckCircle2 size={18} /> : <span>{i + 1}</span>}
          </div>
          {i < total - 1 && <div className={`step-line ${i < step ? 'filled' : ''}`} />}
        </div>
      ))}
    </div>
  );
}

/* ── Option Button (radio-style) ── */
function OptionBtn({ active, label, Icon, onClick }) {
  return (
    <button className={`option-btn ${active ? 'active' : ''}`} onClick={onClick} type="button">
      {Icon && <Icon size={18} />}
      <span>{label}</span>
    </button>
  );
}

/* ── Difficulty Meter ── */
function DifficultyMeter({ intensity }) {
  const color = (i) => {
    if (i >= intensity) return 'var(--meter-empty)';
    if (intensity <= 3) return 'var(--meter-easy)';
    if (intensity <= 6) return 'var(--meter-medium)';
    return 'var(--meter-hard)';
  };
  return (
    <div className="meter-bar">
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="meter-seg" style={{ backgroundColor: color(i) }} />
      ))}
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ Icon, label, value, sub, accent }) {
  return (
    <div className={`glass-card stat-card ${accent || ''}`}>
      <div className="stat-icon-wrap"><Icon size={24} /></div>
      <div className="stat-body">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
        {sub && <span className="stat-sub">{sub}</span>}
      </div>
    </div>
  );
}

/* ── Routine Mini-list ── */
function Routine({ title, Icon, items, accent }) {
  return (
    <div className={`glass-card routine-card ${accent}`}>
      <h4 className="routine-title"><Icon size={18} /> {title}</h4>
      <ol className="routine-list">
        {items.map((it, i) => (
          <li key={i}><strong>{it.name}</strong> <span className="routine-dur">({it.dur})</span> — {it.desc}</li>
        ))}
      </ol>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════ */
function App() {
  /* ── Wizard State ── */
  const [step, setStep] = useState(0);
  const totalSteps = 4;

  // Step 1: Bio
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  // Step 2: Status
  const [activity, setActivity] = useState('active');
  const [injury, setInjury] = useState('None');

  // Step 3: Goals
  const [goal, setGoal] = useState('lose');
  const [location, setLocation] = useState('gym');

  // Step 4: Frequency
  const [days, setDays] = useState(4);

  // Dashboard
  const [dashboard, setDashboard] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [errors, setErrors] = useState({});
  const dashRef = useRef(null);

  /* ── Validation ── */
  function validateStep() {
    const e = {};
    if (step === 0) {
      const a = parseInt(age);
      if (!age || isNaN(a) || a < 10 || a > 100) e.age = 'العمر بين 10 و 100';
      const h = parseInt(height);
      if (!height || isNaN(h) || h < 100 || h > 250) e.height = 'الطول بين 100 و 250 سم';
      const w = parseInt(weight);
      if (!weight || isNaN(w) || w < 30 || w > 250) e.weight = 'الوزن بين 30 و 250 كغ';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() { if (validateStep()) setStep((s) => Math.min(s + 1, totalSteps - 1)); }
  function prevStep() { setStep((s) => Math.max(s - 1, 0)); }

  /* ── Generate Dashboard ── */
  function generate() {
    if (!validateStep()) return;
    const a = parseInt(age), h = parseInt(height), w = parseInt(weight);
    const bmi = calcBMI(w, h);
    const bmiCat = getBMICategory(bmi);
    const bmr = calcBMR(gender, w, h, a);
    const tdee = calcTDEE(bmr, activity);
    const cals = goalCalories(tdee, goal);
    const water = waterIntake(w);
    const template = getSplitTemplate(days);
    const schedule = generateSchedule(template, { age: a, injury, location, goal });

    setDashboard({ bmi, bmiCat, tdee, cals, water, schedule, ageNum: a });
    setActiveDay(0);
    setStep(totalSteps); // move past wizard
    setTimeout(() => dashRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  /* ── Reset ── */
  function reset() {
    setDashboard(null);
    setStep(0);
    setActiveDay(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Render ── */
  const showWizard = step < totalSteps && !dashboard;
  const showDash = !!dashboard;

  return (
    <div className="app">
      {/* BG */}
      <div className="bg-noise" />
      <div className="bg-grid" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />

      {/* ══════════ HERO ══════════ */}
      {!showDash && (
        <header className="hero">
          <div className="hero-content">
            <span className="hero-badge"><Brain size={14} /> لوحة اللياقة الذكية</span>
            <h1 className="hero-headline">جسمك، بياناتك، خطتك المثالية</h1>
            <p className="hero-sub">
              محرك ذكاء رياضي يحسب مؤشر كتلة جسمك، سعراتك اليومية، ويولّد جدولاً أسبوعياً مفصّلاً — في ثوانٍ.
            </p>
            {step === 0 && !dashboard && (
              <button className="hero-cta" onClick={() => document.getElementById('wizard')?.scrollIntoView({ behavior: 'smooth' })}>
                <ArrowDown size={18} /> ابدأ الآن
              </button>
            )}
          </div>
          <div className="hero-shape shape-1" />
          <div className="hero-shape shape-2" />
        </header>
      )}

      {/* ══════════ WIZARD ══════════ */}
      {showWizard && (
        <section id="wizard" className="wizard-section">
          <div className="glass-card wizard-card">
            <WizardProgress step={step} total={totalSteps} />

            <div className="wizard-body" key={step}>
              {/* STEP 0: Bio */}
              {step === 0 && (
                <div className="step-content fade-in">
                  <h2 className="step-title"><UserRound size={22} /> البيانات الجسدية</h2>
                  <div className="option-row">
                    {GENDER_OPTS.map((g) => (
                      <OptionBtn key={g.v} active={gender === g.v} label={g.l}
                        Icon={g.v === 'male' ? UserRound : UserRound} onClick={() => setGender(g.v)} />
                    ))}
                  </div>
                  <div className="input-grid">
                    <div className="form-group">
                      <label><Ruler size={15} /> العمر</label>
                      <input type="number" min="10" max="100" placeholder="مثال: 25" value={age} onChange={(e) => setAge(e.target.value)} />
                      {errors.age && <span className="field-err">{errors.age}</span>}
                    </div>
                    <div className="form-group">
                      <label><Ruler size={15} /> الطول (سم)</label>
                      <input type="number" min="100" max="250" placeholder="مثال: 175" value={height} onChange={(e) => setHeight(e.target.value)} />
                      {errors.height && <span className="field-err">{errors.height}</span>}
                    </div>
                    <div className="form-group">
                      <label><Weight size={15} /> الوزن (كغ)</label>
                      <input type="number" min="30" max="250" placeholder="مثال: 75" value={weight} onChange={(e) => setWeight(e.target.value)} />
                      {errors.weight && <span className="field-err">{errors.weight}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: Status */}
              {step === 1 && (
                <div className="step-content fade-in">
                  <h2 className="step-title"><Activity size={22} /> الحالة البدنية</h2>
                  <p className="step-desc">مستوى النشاط اليومي</p>
                  <div className="option-row">
                    {ACTIVITY_OPTS.map((a) => (
                      <OptionBtn key={a.v} active={activity === a.v} label={a.l} onClick={() => setActivity(a.v)} />
                    ))}
                  </div>
                  <p className="step-desc" style={{ marginTop: 24 }}>هل لديك إصابة؟</p>
                  <div className="option-row">
                    {INJURY_OPTS.map((inj) => (
                      <OptionBtn key={inj.v} active={injury === inj.v} label={inj.l}
                        Icon={inj.v === 'None' ? ShieldCheck : BriefcaseMedical} onClick={() => setInjury(inj.v)} />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Goals */}
              {step === 2 && (
                <div className="step-content fade-in">
                  <h2 className="step-title"><Target size={22} /> الهدف والمكان</h2>
                  <p className="step-desc">الهدف الأساسي</p>
                  <div className="option-row">
                    {GOAL_OPTS.map((g) => (
                      <OptionBtn key={g.v} active={goal === g.v} label={g.l}
                        Icon={g.v === 'lose' ? TrendingUp : g.v === 'gain' ? Dumbbell : HeartPulse}
                        onClick={() => setGoal(g.v)} />
                    ))}
                  </div>
                  <p className="step-desc" style={{ marginTop: 24 }}>مكان التمرين</p>
                  <div className="option-row">
                    {LOCATION_OPTS.map((loc) => (
                      <OptionBtn key={loc.v} active={location === loc.v} label={loc.l}
                        Icon={loc.v === 'gym' ? Dumbbell : Home} onClick={() => setLocation(loc.v)} />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Frequency */}
              {step === 3 && (
                <div className="step-content fade-in">
                  <h2 className="step-title"><CalendarDays size={22} /> أيام التدريب</h2>
                  <p className="step-desc">كم يوم تستطيع التدريب أسبوعياً؟</p>
                  <div className="option-row days-row">
                    {DAYS_OPTS.map((d) => (
                      <OptionBtn key={d} active={days === d} label={`${d} أيام`}
                        Icon={CalendarDays} onClick={() => setDays(d)} />
                    ))}
                  </div>
                  <div className="split-preview glass-card">
                    <h4><Sparkles size={16} /> نوع التقسيم</h4>
                    <ul>
                      {getSplitTemplate(days).map((s, i) => {
                        const SIcon = SPLIT_ICONS[s.type] || Dumbbell;
                        return <li key={i}><SIcon size={14} /> <strong>{s.day}:</strong> {s.label}</li>;
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Nav Buttons */}
            <div className="wizard-nav">
              {step > 0 && (
                <button className="nav-btn nav-prev" onClick={prevStep}>
                  <ChevronRight size={18} /> السابق
                </button>
              )}
              {step < totalSteps - 1 ? (
                <button className="nav-btn nav-next" onClick={nextStep}>
                  التالي <ChevronLeft size={18} />
                </button>
              ) : (
                <button className="cta-btn generate-btn" onClick={generate}>
                  <Sparkles size={20} /> توليد الخطة الذكية
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══════════ DASHBOARD ══════════ */}
      {showDash && (
        <section ref={dashRef} className="dashboard fade-in">
          {/* Top bar */}
          <div className="dash-top-bar">
            <h1 className="dash-title"><Brain size={24} /> لوحة اللياقة الذكية</h1>
            <button className="reset-btn" onClick={reset}><ArrowDown size={16} style={{ transform: 'rotate(180deg)' }} /> خطة جديدة</button>
          </div>

          {/* ── Stat Cards ── */}
          <div className="stats-grid">
            <StatCard
              Icon={BarChart3} label="مؤشر كتلة الجسم (BMI)"
              value={dashboard.bmi.toFixed(1)}
              sub={`${dashboard.bmiCat.emoji} ${dashboard.bmiCat.label}`}
              accent="stat-bmi"
            />
            <StatCard
              Icon={Flame} label="السعرات اليومية"
              value={`${dashboard.cals}`}
              sub={goal === 'lose' ? 'عجز 500 سعرة' : goal === 'gain' ? 'فائض 350 سعرة' : 'صيانة'}
              accent="stat-cal"
            />
            <StatCard
              Icon={Droplets} label="الماء يومياً"
              value={`${dashboard.water} لتر`}
              sub={`${Math.round(dashboard.water * 4)} أكواب تقريباً`}
              accent="stat-water"
            />
            <StatCard
              Icon={CalendarDays} label="أيام التدريب"
              value={`${days} أيام / أسبوع`}
              sub={days <= 3 ? 'جسم كامل' : days <= 4 ? 'تقسيم علوي / سفلي' : 'دفع / سحب / أرجل'}
              accent="stat-days"
            />
          </div>

          {/* ── Weekly Schedule Tabs ── */}
          <div className="schedule-section">
            <h2 className="section-heading"><CalendarDays size={22} /> الجدول الأسبوعي</h2>

            <div className="day-tabs">
              {dashboard.schedule.map((slot, i) => {
                const SIcon = SPLIT_ICONS[slot.type] || Dumbbell;
                return (
                  <button key={i} className={`day-tab ${activeDay === i ? 'active' : ''}`} onClick={() => setActiveDay(i)}>
                    <SIcon size={16} />
                    <span className="tab-day">{slot.day}</span>
                    <span className="tab-label">{slot.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Day Content */}
            {dashboard.schedule[activeDay] && (
              <div className="day-content fade-in" key={activeDay}>
                {/* Warm-up */}
                <Routine title="الإحماء (7 د)" Icon={Flame} items={WARMUP} accent="warmup-accent" />

                {/* Exercises */}
                <div className="exercises-grid">
                  {dashboard.schedule[activeDay].exercises.map((ex, i) => (
                    <div key={ex.id} className="glass-card exercise-card" style={{ animationDelay: `${i * 0.07}s` }}>
                      <div className="ex-head">
                        <h4 className="ex-name">{ex.name}</h4>
                        <span className={`impact-badge impact-${ex.impactLevel.toLowerCase()}`}>
                          {ex.impactLevel === 'Low' ? 'آمن' : 'عالي'}
                        </span>
                      </div>
                      <p className="ex-desc">{ex.instructions}</p>
                      <div className="ex-stats">
                        <span className="ex-stat"><Dumbbell size={13} /> {ex.sets} × {ex.reps}</span>
                        <span className="ex-stat"><Timer size={13} /> شدة {ex.intensity}/10</span>
                      </div>
                      <DifficultyMeter intensity={ex.intensity} />
                      <div className="ex-tags">
                        {ex.muscleGroups.slice(0, 3).map((mg) => (
                          <span key={mg} className="muscle-tag">{mg}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cool-down */}
                <Routine title="التهدئة (7 د)" Icon={Snowflake} items={COOLDOWN} accent="cooldown-accent" />
              </div>
            )}
          </div>

          {/* ── Tips ── */}
          <div className="tips-section">
            <h2 className="section-heading"><Lightbulb size={22} /> نصائح ذكية</h2>
            <div className="tips-grid">
              {injury !== 'None' && (
                <div className="glass-card tip-card">
                  <ShieldCheck size={22} className="tip-icon" />
                  <h4>سلامتك أولاً</h4>
                  <p>تم استبعاد جميع التمارين التي قد تؤثر على إصابة {INJURY_OPTS.find(o => o.v === injury)?.l}. استشر طبيبك دائماً.</p>
                </div>
              )}
              <div className="glass-card tip-card">
                <Droplets size={22} className="tip-icon" />
                <h4>الترطيب</h4>
                <p>اشرب {dashboard.water} لتر ماء يومياً على الأقل. زِد الكمية في أيام التدريب بـ 0.5 لتر.</p>
              </div>
              <div className="glass-card tip-card">
                <Clock size={22} className="tip-icon" />
                <h4>الاستشفاء</h4>
                <p>نَم 7-9 ساعات يومياً. العضلات تنمو أثناء الراحة وليس أثناء التمرين.</p>
              </div>
              <div className="glass-card tip-card">
                <Flame size={22} className="tip-icon" />
                <h4>التغذية</h4>
                <p>استهدف {dashboard.cals} سعرة يومياً مع {goal === 'gain' ? '1.8-2.2 غ بروتين/كغ' : '1.4-1.6 غ بروتين/كغ'}.</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="site-footer">
            <p>صُنع بـ ❤️ من أجل مجتمع أكثر صحة</p>
            <p className="footer-copy">&copy; {new Date().getFullYear()} Fitness AI Dashboard</p>
          </footer>
        </section>
      )}

      {/* Footer when wizard showing */}
      {showWizard && (
        <footer className="site-footer">
          <p>صُنع بـ ❤️ من أجل مجتمع أكثر صحة</p>
          <p className="footer-copy">&copy; {new Date().getFullYear()} Fitness AI Dashboard</p>
        </footer>
      )}
    </div>
  );
}

export default App;
