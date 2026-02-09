export type Language = 'ja' | 'en' | 'zh';

interface StepContent {
  title: string;
  description: string;
}

export interface Translation {
  appTitle: string;
  startRoutine: string;
  todayProgress: string;
  completedTimes: string;
  settings: string;
  enterName: string;
  nameLabel: string;
  namePlaceholder: string;
  
  morningRoutine: string;
  afternoonRoutine: string;
  selectRoutineType: string;
  leaveHome: string;
  wipeDownRoutine: string;
  eyeExercise: string;
  stretchingExercise: string;
  
  step: string;
  of: string;
  next: string;
  back: string;
  skip: string;
  pause: string;
  resume: string;
  exitRoutine: string;
  exitConfirmTitle: string;
  exitConfirmMessage: string;
  cancel: string;
  confirm: string;
  finish: string;
  
  minutesShort: string;
  secondsShort: string;
  timeRemaining: string;
  
  howDoYouFeel: string;
  veryBad: string;
  bad: string;
  neutral: string;
  good: string;
  veryGood: string;
  optionalComment: string;
  complete: string;
  greatJob: string;
  
  language: string;
  japanese: string;
  english: string;
  chinese: string;
  about: string;
  version: string;
  
  history: string;
  loading: string;
  noHistory: string;
  
  morningIntroSteps: Record<string, StepContent>;
  morningSteps: Record<string, StepContent>;
  eyeExerciseSteps: Record<string, StepContent>;
  stretchingSteps: Record<string, StepContent>;
  preparation: string;
}

export const translations: Record<Language, Translation> = {
  ja: {
    appTitle: 'ルーティンサポート',
    startRoutine: 'ルーティンを開始',
    todayProgress: '今日の進捗',
    completedTimes: '回完了',
    settings: '設定',
    enterName: 'お名前を入力してください',
    nameLabel: 'お名前',
    namePlaceholder: 'お名前',
    
    morningRoutine: '朝のルーティン',
    afternoonRoutine: '午後のルーティン',
    selectRoutineType: 'ルーティンを選択',
    leaveHome: '家を出る',
    wipeDownRoutine: 'ふきそうじルーティン',
    eyeExercise: '目の体操',
    stretchingExercise: 'ストレッチ運動',
    
    step: 'ステップ',
    of: '/',
    next: '次へ',
    back: '戻る',
    skip: 'スキップ',
    pause: '一時停止',
    resume: '再開',
    exitRoutine: '終了',
    exitConfirmTitle: 'ルーティンを終了しますか?',
    exitConfirmMessage: '進捗は保存されません。',
    cancel: 'キャンセル',
    confirm: '確認',
    finish: '完了',
    
    minutesShort: '分',
    secondsShort: '秒',
    timeRemaining: '残り時間',
    
    howDoYouFeel: '今の気分は?',
    veryBad: 'とても悪い',
    bad: '悪い',
    neutral: '普通',
    good: '良い',
    veryGood: 'とても良い',
    optionalComment: 'コメント (任意)',
    complete: '完了',
    greatJob: 'お疲れ様でした、',
    
    language: '言語',
    japanese: '日本語',
    english: 'English',
    chinese: '中文',
    about: 'アプリについて',
    version: 'バージョン',
    
    history: '履歴',
    loading: '読み込み中...',
    noHistory: 'まだ記録がありません',
    preparation: '準備',
    
    morningIntroSteps: {
      intro1: { title: '白い布', description: '白い布を用意してください' },
      intro2: { title: '緑の布', description: '緑の布を用意してください' },
      intro3: { title: 'ピンクのバケツ', description: 'ピンクのバケツを用意してください' },
      intro4: { title: 'デトールスプレー', description: 'デトールスプレーを用意してください' },
    },
    
    morningSteps: {
      step1: { title: 'Wipe Down Routine – Step 1 / 9', description: 'Step 1: Take white cloth' },
      step2: { title: 'Wipe Down Routine – Step 2 / 9', description: 'Step 2: rinse white cloth in the pail' },
      step3: { title: 'Wipe Down Routine – Step 3 / 9', description: 'Step 3: Wipe table and chair' },
      step4: { title: 'Wipe Down Routine – Step 4 / 9', description: 'Step 4: Put white cloth in the pink pail' },
      step5: { title: 'Wipe Down Routine – Step 5 / 9', description: 'Step 5: Take green cloth' },
      step6: { title: 'Wipe Down Routine – Step 6 / 9', description: 'Step 6: Spray Dettol 2 times on green cloth' },
      step7: { title: 'Wipe Down Routine – Step 7 / 9', description: 'Step 7: Wipe table and chair' },
      step8: { title: 'Wipe Down Routine – Step 8 / 9', description: 'Step 8: Take white cloth from the pink pail' },
      step9: { title: 'Wipe Down Routine – Step 9 / 9', description: 'Step 9: Wash green and white cloth' },
    },
    
    eyeExerciseSteps: {
      step1: { title: 'Eye Exercise – Step 1 / 9', description: 'Step 1: wash hands with soap' },
      step2: { title: 'Eye Exercise – Step 2 / 9', description: 'Step 2: dry hands with clean towel' },
      step3: { title: 'Eye Exercise – Step 3 / 9', description: 'Step 3: Rub palms together to create heat' },
      step4: { title: 'Eye Exercise – Step 4 / 9', description: 'Step 4: Put palms over eyes and count to 10' },
      step5: { title: 'Eye Exercise – Step 5 / 9', description: 'Step 5: place fingers on the top of the nose, beside eyes\nPress and move fingers in circle movement, count to 10' },
      step6: { title: 'Eye Exercise – Step 6 / 9', description: 'Step 6: Place finger in the middle of eyebrow,\nPress gently move fingers in a circle motion for 10 times' },
      step7: { title: 'Eye Exercise – Step 7 / 9', description: 'Step 7: Place finger on temples, side of forehead\nPress gently, move fingers in a circle motion for 10 times' },
      step8: { title: 'Eye Exercise – Step 8 / 9', description: 'Step 8: Place finger under eyes, press gently and move\nfingers in a circle motion for 10 times' },
      step9: { title: 'Eye Exercise – Step 9 / 9', description: 'Step 9: Place thumb at the back of the head at the bottom\nPress gently and move fingers in a circle motion for 10 times' },
    },
    
    stretchingSteps: {
      step1: { title: 'Stretching Exercise – Step 1 / 16', description: 'Step 1: You can sit or stand\nMarch on the spot, count to 10' },
      step2: { title: 'Stretching Exercise – Step 2 / 16', description: 'Step 2: Tilt head to the left, hold and count to 10' },
      step3: { title: 'Stretching Exercise – Step 3 / 16', description: 'Step 3: Tilt head to the right, hold and count to 10' },
      step4: { title: 'Stretching Exercise – Step 4 / 16', description: 'Step 4: turn your head to the left, count to 10' },
      step5: { title: 'Stretching Exercise – Step 5 / 16', description: 'Step 5: turn your head to the right, count to 10' },
      step6: { title: 'Stretching Exercise – Step 6 / 16', description: 'Step 6: Open up your arms, count to 10' },
      step7: { title: 'Stretching Exercise – Step 7 / 16', description: 'Step 7: Raise right hand, stretch over the head\nKeep arms straight and close to ears, count to 10' },
      step8: { title: 'Stretching Exercise – Step 8 / 16', description: 'Step 8: Raise left hand, stretch over the head\nKeep arms straight and close to ears, count to 10' },
      step9: { title: 'Stretching Exercise – Step 9 / 16', description: 'Step 9: place right hand behind your neck, count to 10' },
      step10: { title: 'Stretching Exercise – Step 10 / 16', description: 'Step 10: Place left hand behind your neck, count to 10' },
      step11: { title: 'Stretching Exercise – Step 11 / 16', description: 'Step 11: Put right hand out, palm facing down\nUse left hand to push fingers down, count to 10' },
      step12: { title: 'Stretching Exercise – Step 12 / 16', description: 'Step 12: Put left hand out, palm facing down\nUse right hand to push fingers down, count to 10' },
      step13: { title: 'Stretching Exercise – Step 13 / 16', description: 'Step 13: Right leg, take a step to the front, raise the heel\nToes pointing up, lean your body forwards, count to 10' },
      step14: { title: 'Stretching Exercise – Step 14 / 16', description: 'Step 14: Left leg, take a step to the front, raise the heel\nToes pointing up, lean your body forwards, count to 10' },
      step15: { title: 'Stretching Exercise – Step 15 / 16', description: 'Step 15: Raise right leg up, rotate ankle in circle motion\ncount to 10' },
      step16: { title: 'Stretching Exercise – Step 16 / 16', description: 'Step 16: Raise left leg up, rotate ankle in circle motion\ncount to 10' },
    },
  },
  
  en: {
    appTitle: 'Routine Support',
    startRoutine: 'Start Routine',
    todayProgress: "Today's Progress",
    completedTimes: 'times completed',
    settings: 'Settings',
    enterName: 'Please enter your name',
    nameLabel: 'Name',
    namePlaceholder: 'Your Name',
    
    morningRoutine: 'Morning Routine',
    afternoonRoutine: 'Afternoon Routine',
    selectRoutineType: 'Select Routine',
    leaveHome: 'Leave Home',
    wipeDownRoutine: 'Wipe Down Routine',
    eyeExercise: 'Eye Exercise',
    stretchingExercise: 'Stretching Exercise',
    
    step: 'Step',
    of: 'of',
    next: 'Next',
    back: 'Back',
    skip: 'Skip',
    pause: 'Pause',
    resume: 'Resume',
    exitRoutine: 'Exit',
    exitConfirmTitle: 'Exit routine?',
    exitConfirmMessage: 'Your progress will not be saved.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    finish: 'Finish',
    
    minutesShort: 'min',
    secondsShort: 'sec',
    timeRemaining: 'Time Remaining',
    
    howDoYouFeel: 'How do you feel?',
    veryBad: 'Very Bad',
    bad: 'Bad',
    neutral: 'Neutral',
    good: 'Good',
    veryGood: 'Very Good',
    optionalComment: 'Comment (Optional)',
    complete: 'Complete',
    greatJob: 'Good Job, ',
    
    language: 'Language',
    japanese: '日本語',
    english: 'English',
    chinese: '中文',
    about: 'About',
    version: 'Version',
    
    history: 'History',
    loading: 'Loading...',
    noHistory: 'No records yet',
    preparation: 'Preparation',
    
    morningIntroSteps: {
      intro1: { title: 'White Cloth', description: 'Prepare the white cloth' },
      intro2: { title: 'Green Cloth', description: 'Prepare the green cloth' },
      intro3: { title: 'Pink Pail', description: 'Prepare the pink pail' },
      intro4: { title: 'Dettol Spray', description: 'Prepare the Dettol spray' },
    },
    
    morningSteps: {
      step1: { title: 'Wipe Down Routine – Step 1 / 9', description: 'Step 1: Take white cloth' },
      step2: { title: 'Wipe Down Routine – Step 2 / 9', description: 'Step 2: rinse white cloth in the pail' },
      step3: { title: 'Wipe Down Routine – Step 3 / 9', description: 'Step 3: Wipe table and chair' },
      step4: { title: 'Wipe Down Routine – Step 4 / 9', description: 'Step 4: Put white cloth in the pink pail' },
      step5: { title: 'Wipe Down Routine – Step 5 / 9', description: 'Step 5: Take green cloth' },
      step6: { title: 'Wipe Down Routine – Step 6 / 9', description: 'Step 6: Spray Dettol 2 times on green cloth' },
      step7: { title: 'Wipe Down Routine – Step 7 / 9', description: 'Step 7: Wipe table and chair' },
      step8: { title: 'Wipe Down Routine – Step 8 / 9', description: 'Step 8: Take white cloth from the pink pail' },
      step9: { title: 'Wipe Down Routine – Step 9 / 9', description: 'Step 9: Wash green and white cloth' },
    },
    
    eyeExerciseSteps: {
      step1: { title: 'Eye Exercise – Step 1 / 9', description: 'Step 1: wash hands with soap' },
      step2: { title: 'Eye Exercise – Step 2 / 9', description: 'Step 2: dry hands with clean towel' },
      step3: { title: 'Eye Exercise – Step 3 / 9', description: 'Step 3: Rub palms together to create heat' },
      step4: { title: 'Eye Exercise – Step 4 / 9', description: 'Step 4: Put palms over eyes and count to 10' },
      step5: { title: 'Eye Exercise – Step 5 / 9', description: 'Step 5: place fingers on the top of the nose, beside eyes\nPress and move fingers in circle movement, count to 10' },
      step6: { title: 'Eye Exercise – Step 6 / 9', description: 'Step 6: Place finger in the middle of eyebrow,\nPress gently move fingers in a circle motion for 10 times' },
      step7: { title: 'Eye Exercise – Step 7 / 9', description: 'Step 7: Place finger on temples, side of forehead\nPress gently, move fingers in a circle motion for 10 times' },
      step8: { title: 'Eye Exercise – Step 8 / 9', description: 'Step 8: Place finger under eyes, press gently and move\nfingers in a circle motion for 10 times' },
      step9: { title: 'Eye Exercise – Step 9 / 9', description: 'Step 9: Place thumb at the back of the head at the bottom\nPress gently and move fingers in a circle motion for 10 times' },
    },
    
    stretchingSteps: {
      step1: { title: 'Stretching Exercise – Step 1 / 16', description: 'Step 1: You can sit or stand\nMarch on the spot, count to 10' },
      step2: { title: 'Stretching Exercise – Step 2 / 16', description: 'Step 2: Tilt head to the left, hold and count to 10' },
      step3: { title: 'Stretching Exercise – Step 3 / 16', description: 'Step 3: Tilt head to the right, hold and count to 10' },
      step4: { title: 'Stretching Exercise – Step 4 / 16', description: 'Step 4: turn your head to the left, count to 10' },
      step5: { title: 'Stretching Exercise – Step 5 / 16', description: 'Step 5: turn your head to the right, count to 10' },
      step6: { title: 'Stretching Exercise – Step 6 / 16', description: 'Step 6: Open up your arms, count to 10' },
      step7: { title: 'Stretching Exercise – Step 7 / 16', description: 'Step 7: Raise right hand, stretch over the head\nKeep arms straight and close to ears, count to 10' },
      step8: { title: 'Stretching Exercise – Step 8 / 16', description: 'Step 8: Raise left hand, stretch over the head\nKeep arms straight and close to ears, count to 10' },
      step9: { title: 'Stretching Exercise – Step 9 / 16', description: 'Step 9: place right hand behind your neck, count to 10' },
      step10: { title: 'Stretching Exercise – Step 10 / 16', description: 'Step 10: Place left hand behind your neck, count to 10' },
      step11: { title: 'Stretching Exercise – Step 11 / 16', description: 'Step 11: Put right hand out, palm facing down\nUse left hand to push fingers down, count to 10' },
      step12: { title: 'Stretching Exercise – Step 12 / 16', description: 'Step 12: Put left hand out, palm facing down\nUse right hand to push fingers down, count to 10' },
      step13: { title: 'Stretching Exercise – Step 13 / 16', description: 'Step 13: Right leg, take a step to the front, raise the heel\nToes pointing up, lean your body forwards, count to 10' },
      step14: { title: 'Stretching Exercise – Step 14 / 16', description: 'Step 14: Left leg, take a step to the front, raise the heel\nToes pointing up, lean your body forwards, count to 10' },
      step15: { title: 'Stretching Exercise – Step 15 / 16', description: 'Step 15: Raise right leg up, rotate ankle in circle motion\ncount to 10' },
      step16: { title: 'Stretching Exercise – Step 16 / 16', description: 'Step 16: Raise left leg up, rotate ankle in circle motion\ncount to 10' },
    },
  },
  
  zh: {
    appTitle: '日常支持',
    startRoutine: '开始日常',
    todayProgress: '今日进度',
    completedTimes: '次完成',
    settings: '设置',
    enterName: '请输入您的名字',
    nameLabel: '名字',
    namePlaceholder: '您的名字',
    
    morningRoutine: '早晨日常',
    afternoonRoutine: '下午日常',
    selectRoutineType: '选择日常',
    leaveHome: '出门',
    wipeDownRoutine: '擦拭清洁',
    eyeExercise: '眼保健操',
    stretchingExercise: '拉伸运动',
    
    step: '步骤',
    of: '/',
    next: '下一步',
    back: '返回',
    skip: '跳过',
    pause: '暂停',
    resume: '继续',
    exitRoutine: '退出',
    exitConfirmTitle: '退出日常?',
    exitConfirmMessage: '您的进度将不会被保存。',
    cancel: '取消',
    confirm: '确认',
    finish: '完成',
    
    minutesShort: '分',
    secondsShort: '秒',
    timeRemaining: '剩余时间',
    
    howDoYouFeel: '感觉如何?',
    veryBad: '非常糟糕',
    bad: '糟糕',
    neutral: '一般',
    good: '良好',
    veryGood: '非常好',
    optionalComment: '评论 (可选)',
    complete: '完成',
    greatJob: '辛苦了, ',
    
    language: '语言',
    japanese: '日本語',
    english: 'English',
    chinese: '中文',
    about: '关于',
    version: '版本',
    
    history: '历史记录',
    loading: '加载中...',
    noHistory: '还没有记录',
    preparation: '准备',
    
    morningIntroSteps: {
      intro1: { title: '白布', description: '请准备白布' },
      intro2: { title: '绿布', description: '请准备绿布' },
      intro3: { title: '粉色水桶', description: '请准备粉色水桶' },
      intro4: { title: '滴露喷雾', description: '请准备滴露喷雾' },
    },
    
    morningSteps: {
      step1: { title: 'Wipe Down Routine – Step 1 / 9', description: 'Step 1: Take white cloth' },
      step2: { title: 'Wipe Down Routine – Step 2 / 9', description: 'Step 2: rinse white cloth in the pail' },
      step3: { title: 'Wipe Down Routine – Step 3 / 9', description: 'Step 3: Wipe table and chair' },
      step4: { title: 'Wipe Down Routine – Step 4 / 9', description: 'Step 4: Put white cloth in the pink pail' },
      step5: { title: 'Wipe Down Routine – Step 5 / 9', description: 'Step 5: Take green cloth' },
      step6: { title: 'Wipe Down Routine – Step 6 / 9', description: 'Step 6: Spray Dettol 2 times on green cloth' },
      step7: { title: 'Wipe Down Routine – Step 7 / 9', description: 'Step 7: Wipe table and chair' },
      step8: { title: 'Wipe Down Routine – Step 8 / 9', description: 'Step 8: Take white cloth from the pink pail' },
      step9: { title: 'Wipe Down Routine – Step 9 / 9', description: 'Step 9: Wash green and white cloth' },
    },
    
    eyeExerciseSteps: {
      step1: { title: 'Eye Exercise – Step 1 / 9', description: 'Step 1: wash hands with soap' },
      step2: { title: 'Eye Exercise – Step 2 / 9', description: 'Step 2: dry hands with clean towel' },
      step3: { title: 'Eye Exercise – Step 3 / 9', description: 'Step 3: Rub palms together to create heat' },
      step4: { title: 'Eye Exercise – Step 4 / 9', description: 'Step 4: Put palms over eyes and count to 10' },
      step5: { title: 'Eye Exercise – Step 5 / 9', description: 'Step 5: place fingers on the top of the nose, beside eyes\nPress and move fingers in circle movement, count to 10' },
      step6: { title: 'Eye Exercise – Step 6 / 9', description: 'Step 6: Place finger in the middle of eyebrow,\nPress gently move fingers in a circle motion for 10 times' },
      step7: { title: 'Eye Exercise – Step 7 / 9', description: 'Step 7: Place finger on temples, side of forehead\nPress gently, move fingers in a circle motion for 10 times' },
      step8: { title: 'Eye Exercise – Step 8 / 9', description: 'Step 8: Place finger under eyes, press gently and move\nfingers in a circle motion for 10 times' },
      step9: { title: 'Eye Exercise – Step 9 / 9', description: 'Step 9: Place thumb at the back of the head at the bottom\nPress gently and move fingers in a circle motion for 10 times' },
    },
    
    stretchingSteps: {
      step1: { title: 'Stretching Exercise – Step 1 / 16', description: 'Step 1: You can sit or stand\nMarch on the spot, count to 10' },
      step2: { title: 'Stretching Exercise – Step 2 / 16', description: 'Step 2: Tilt head to the left, hold and count to 10' },
      step3: { title: 'Stretching Exercise – Step 3 / 16', description: 'Step 3: Tilt head to the right, hold and count to 10' },
      step4: { title: 'Stretching Exercise – Step 4 / 16', description: 'Step 4: turn your head to the left, count to 10' },
      step5: { title: 'Stretching Exercise – Step 5 / 16', description: 'Step 5: turn your head to the right, count to 10' },
      step6: { title: 'Stretching Exercise – Step 6 / 16', description: 'Step 6: Open up your arms, count to 10' },
      step7: { title: 'Stretching Exercise – Step 7 / 16', description: 'Step 7: Raise right hand, stretch over the head\nKeep arms straight and close to ears, count to 10' },
      step8: { title: 'Stretching Exercise – Step 8 / 16', description: 'Step 8: Raise left hand, stretch over the head\nKeep arms straight and close to ears, count to 10' },
      step9: { title: 'Stretching Exercise – Step 9 / 16', description: 'Step 9: place right hand behind your neck, count to 10' },
      step10: { title: 'Stretching Exercise – Step 10 / 16', description: 'Step 10: Place left hand behind your neck, count to 10' },
      step11: { title: 'Stretching Exercise – Step 11 / 16', description: 'Step 11: Put right hand out, palm facing down\nUse left hand to push fingers down, count to 10' },
      step12: { title: 'Stretching Exercise – Step 12 / 16', description: 'Step 12: Put left hand out, palm facing down\nUse right hand to push fingers down, count to 10' },
      step13: { title: 'Stretching Exercise – Step 13 / 16', description: 'Step 13: Right leg, take a step to the front, raise the heel\nToes pointing up, lean your body forwards, count to 10' },
      step14: { title: 'Stretching Exercise – Step 14 / 16', description: 'Step 14: Left leg, take a step to the front, raise the heel\nToes pointing up, lean your body forwards, count to 10' },
      step15: { title: 'Stretching Exercise – Step 15 / 16', description: 'Step 15: Raise right leg up, rotate ankle in circle motion\ncount to 10' },
      step16: { title: 'Stretching Exercise – Step 16 / 16', description: 'Step 16: Raise left leg up, rotate ankle in circle motion\ncount to 10' },
    },
  },
};
