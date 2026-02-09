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
      step1: { title: '白い布を取る', description: 'Step 1: Take white cloth' },
      step2: { title: 'バケツで布をすすぐ', description: 'Step 2: Rinse white cloth in the pail' },
      step3: { title: 'テーブルと椅子を拭く', description: 'Step 3: Wipe table and chair' },
      step4: { title: 'ピンクのバケツに白い布を入れる', description: 'Step 4: Put white cloth in the pink pail' },
      step5: { title: '緑の布を取る', description: 'Step 5: Take green cloth' },
      step6: { title: 'デトールを2回スプレーする', description: 'Step 6: Spray Dettol 2 times on green cloth' },
      step7: { title: 'テーブルと椅子を拭く', description: 'Step 7: Wipe table and chair' },
      step8: { title: 'ピンクのバケツから白い布を取る', description: 'Step 8: Take white cloth from the pink pail' },
      step9: { title: '緑と白の布を洗う', description: 'Step 9: Wash green and white cloth' },
    },
    
    eyeExerciseSteps: {
      step1: { title: '石鹸で手を洗う', description: 'Step 1: Wash hands with soap' },
      step2: { title: 'きれいなタオルで手を拭く', description: 'Step 2: Dry hands with clean towel' },
      step3: { title: '手のひらをこすり合わせて温める', description: 'Step 3: Rub palms together to create heat' },
      step4: { title: '手のひらを目の上に置いて10数える', description: 'Step 4: Put palms over eyes and count to 10' },
      step5: { title: '鼻の上に指を置き、円を描くように動かして10数える', description: 'Step 5: Place fingers on the top of the nose, beside eyes. Press and move fingers in circle movement, count to 10' },
      step6: { title: '眉毛の真ん中に指を置き、円を描くように10回動かす', description: 'Step 6: Place finger in the middle of eyebrow. Press gently, move fingers in a circle motion for 10 times' },
      step7: { title: 'こめかみに指を置き、円を描くように10回動かす', description: 'Step 7: Place finger on temples, side of forehead. Press gently, move fingers in a circle motion for 10 times' },
      step8: { title: '目の下に指を置き、円を描くように10回動かす', description: 'Step 8: Place finger under eyes, press gently and move fingers in a circle motion for 10 times' },
      step9: { title: '頭の後ろの下部に親指を置き、円を描くように10回動かす', description: 'Step 9: Place thumb at the back of the head at the bottom. Press gently and move fingers in a circle motion for 10 times' },
    },
    
    stretchingSteps: {
      step1: { title: '座っても立ってもOK', description: 'Step 1: You can sit or stand. March on the spot, count to 10' },
      step2: { title: '頭を左に傾ける', description: 'Step 2: Tilt head to the left, hold and count to 10' },
      step3: { title: '頭を右に傾ける', description: 'Step 3: Tilt head to the right, hold and count to 10' },
      step4: { title: '頭を左に回す', description: 'Step 4: Turn your head to the left, count to 10' },
      step5: { title: '頭を右に回す', description: 'Step 5: Turn your head to the right, count to 10' },
      step6: { title: '腕を広げる', description: 'Step 6: Open up your arms, count to 10' },
      step7: { title: '右手を上げて頭の上でストレッチ', description: 'Step 7: Raise right hand, stretch over the head. Keep arms straight and close to ears, count to 10' },
      step8: { title: '左手を上げて頭の上でストレッチ', description: 'Step 8: Raise left hand, stretch over the head. Keep arms straight and close to ears, count to 10' },
      step9: { title: '右手を首の後ろに置く', description: 'Step 9: Place right hand behind your neck, count to 10' },
      step10: { title: '左手を首の後ろに置く', description: 'Step 10: Place left hand behind your neck, count to 10' },
      step11: { title: '右手を出して指を下に押す', description: 'Step 11: Put right hand out, palm facing down. Use left hand to push fingers down, count to 10' },
      step12: { title: '左手を出して指を下に押す', description: 'Step 12: Put left hand out, palm facing down. Use right hand to push fingers down, count to 10' },
      step13: { title: '右足を前に出してかかとを上げる', description: 'Step 13: Right leg, take a step to the front, raise the heel. Toes pointing up, lean your body forwards, count to 10' },
      step14: { title: '左足を前に出してかかとを上げる', description: 'Step 14: Left leg, take a step to the front, raise the heel. Toes pointing up, lean your body forwards, count to 10' },
      step15: { title: '右足を上げて足首を回す', description: 'Step 15: Raise right leg up, rotate ankle in circle motion, count to 10' },
      step16: { title: '左足を上げて足首を回す', description: 'Step 16: Raise left leg up, rotate ankle in circle motion, count to 10' },
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
      step1: { title: 'Take white cloth', description: 'Step 1: Take white cloth' },
      step2: { title: 'Rinse white cloth in the pail', description: 'Step 2: Rinse white cloth in the pail' },
      step3: { title: 'Wipe table and chair', description: 'Step 3: Wipe table and chair' },
      step4: { title: 'Put white cloth in the pink pail', description: 'Step 4: Put white cloth in the pink pail' },
      step5: { title: 'Take green cloth', description: 'Step 5: Take green cloth' },
      step6: { title: 'Spray Dettol 2 times on green cloth', description: 'Step 6: Spray Dettol 2 times on green cloth' },
      step7: { title: 'Wipe table and chair', description: 'Step 7: Wipe table and chair' },
      step8: { title: 'Take white cloth from the pink pail', description: 'Step 8: Take white cloth from the pink pail' },
      step9: { title: 'Wash green and white cloth', description: 'Step 9: Wash green and white cloth' },
    },
    
    eyeExerciseSteps: {
      step1: { title: 'Wash hands with soap', description: 'Step 1: Wash hands with soap' },
      step2: { title: 'Dry hands with clean towel', description: 'Step 2: Dry hands with clean towel' },
      step3: { title: 'Rub palms together to create heat', description: 'Step 3: Rub palms together to create heat' },
      step4: { title: 'Put palms over eyes and count to 10', description: 'Step 4: Put palms over eyes and count to 10' },
      step5: { title: 'Place fingers on the top of the nose', description: 'Step 5: Place fingers on the top of the nose, beside eyes. Press and move fingers in circle movement, count to 10' },
      step6: { title: 'Place finger in the middle of eyebrow', description: 'Step 6: Place finger in the middle of eyebrow. Press gently, move fingers in a circle motion for 10 times' },
      step7: { title: 'Place finger on temples', description: 'Step 7: Place finger on temples, side of forehead. Press gently, move fingers in a circle motion for 10 times' },
      step8: { title: 'Place finger under eyes', description: 'Step 8: Place finger under eyes, press gently and move fingers in a circle motion for 10 times' },
      step9: { title: 'Place thumb at back of head', description: 'Step 9: Place thumb at the back of the head at the bottom. Press gently and move fingers in a circle motion for 10 times' },
    },
    
    stretchingSteps: {
      step1: { title: 'March on the spot', description: 'Step 1: You can sit or stand. March on the spot, count to 10' },
      step2: { title: 'Tilt head to the left', description: 'Step 2: Tilt head to the left, hold and count to 10' },
      step3: { title: 'Tilt head to the right', description: 'Step 3: Tilt head to the right, hold and count to 10' },
      step4: { title: 'Turn head to the left', description: 'Step 4: Turn your head to the left, count to 10' },
      step5: { title: 'Turn head to the right', description: 'Step 5: Turn your head to the right, count to 10' },
      step6: { title: 'Open up your arms', description: 'Step 6: Open up your arms, count to 10' },
      step7: { title: 'Raise right hand, stretch over head', description: 'Step 7: Raise right hand, stretch over the head. Keep arms straight and close to ears, count to 10' },
      step8: { title: 'Raise left hand, stretch over head', description: 'Step 8: Raise left hand, stretch over the head. Keep arms straight and close to ears, count to 10' },
      step9: { title: 'Right hand behind neck', description: 'Step 9: Place right hand behind your neck, count to 10' },
      step10: { title: 'Left hand behind neck', description: 'Step 10: Place left hand behind your neck, count to 10' },
      step11: { title: 'Right hand out, push fingers down', description: 'Step 11: Put right hand out, palm facing down. Use left hand to push fingers down, count to 10' },
      step12: { title: 'Left hand out, push fingers down', description: 'Step 12: Put left hand out, palm facing down. Use right hand to push fingers down, count to 10' },
      step13: { title: 'Right leg step forward', description: 'Step 13: Right leg, take a step to the front, raise the heel. Toes pointing up, lean your body forwards, count to 10' },
      step14: { title: 'Left leg step forward', description: 'Step 14: Left leg, take a step to the front, raise the heel. Toes pointing up, lean your body forwards, count to 10' },
      step15: { title: 'Raise right leg, rotate ankle', description: 'Step 15: Raise right leg up, rotate ankle in circle motion, count to 10' },
      step16: { title: 'Raise left leg, rotate ankle', description: 'Step 16: Raise left leg up, rotate ankle in circle motion, count to 10' },
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
      step1: { title: '拿白布', description: 'Step 1: Take white cloth' },
      step2: { title: '在桶里冲洗白布', description: 'Step 2: Rinse white cloth in the pail' },
      step3: { title: '擦桌椅', description: 'Step 3: Wipe table and chair' },
      step4: { title: '把白布放进粉色桶里', description: 'Step 4: Put white cloth in the pink pail' },
      step5: { title: '拿绿布', description: 'Step 5: Take green cloth' },
      step6: { title: '在绿布上喷2次滴露', description: 'Step 6: Spray Dettol 2 times on green cloth' },
      step7: { title: '擦桌椅', description: 'Step 7: Wipe table and chair' },
      step8: { title: '从粉色桶里拿出白布', description: 'Step 8: Take white cloth from the pink pail' },
      step9: { title: '洗绿布和白布', description: 'Step 9: Wash green and white cloth' },
    },
    
    eyeExerciseSteps: {
      step1: { title: '用肥皂洗手', description: 'Step 1: Wash hands with soap' },
      step2: { title: '用干净毛巾擦手', description: 'Step 2: Dry hands with clean towel' },
      step3: { title: '搓手掌产生热量', description: 'Step 3: Rub palms together to create heat' },
      step4: { title: '手掌盖住眼睛数到10', description: 'Step 4: Put palms over eyes and count to 10' },
      step5: { title: '手指放在鼻梁上方，画圈数到10', description: 'Step 5: Place fingers on the top of the nose, beside eyes. Press and move fingers in circle movement, count to 10' },
      step6: { title: '手指放在眉毛中间，画圈10次', description: 'Step 6: Place finger in the middle of eyebrow. Press gently, move fingers in a circle motion for 10 times' },
      step7: { title: '手指放在太阳穴，画圈10次', description: 'Step 7: Place finger on temples, side of forehead. Press gently, move fingers in a circle motion for 10 times' },
      step8: { title: '手指放在眼下方，画圈10次', description: 'Step 8: Place finger under eyes, press gently and move fingers in a circle motion for 10 times' },
      step9: { title: '拇指放在后脑勺下方，画圈10次', description: 'Step 9: Place thumb at the back of the head at the bottom. Press gently and move fingers in a circle motion for 10 times' },
    },
    
    stretchingSteps: {
      step1: { title: '原地踏步', description: 'Step 1: You can sit or stand. March on the spot, count to 10' },
      step2: { title: '头向左倾斜', description: 'Step 2: Tilt head to the left, hold and count to 10' },
      step3: { title: '头向右倾斜', description: 'Step 3: Tilt head to the right, hold and count to 10' },
      step4: { title: '头转向左边', description: 'Step 4: Turn your head to the left, count to 10' },
      step5: { title: '头转向右边', description: 'Step 5: Turn your head to the right, count to 10' },
      step6: { title: '张开双臂', description: 'Step 6: Open up your arms, count to 10' },
      step7: { title: '右手举过头顶伸展', description: 'Step 7: Raise right hand, stretch over the head. Keep arms straight and close to ears, count to 10' },
      step8: { title: '左手举过头顶伸展', description: 'Step 8: Raise left hand, stretch over the head. Keep arms straight and close to ears, count to 10' },
      step9: { title: '右手放在脖子后面', description: 'Step 9: Place right hand behind your neck, count to 10' },
      step10: { title: '左手放在脖子后面', description: 'Step 10: Place left hand behind your neck, count to 10' },
      step11: { title: '右手伸出，向下按手指', description: 'Step 11: Put right hand out, palm facing down. Use left hand to push fingers down, count to 10' },
      step12: { title: '左手伸出，向下按手指', description: 'Step 12: Put left hand out, palm facing down. Use right hand to push fingers down, count to 10' },
      step13: { title: '右腿向前迈一步', description: 'Step 13: Right leg, take a step to the front, raise the heel. Toes pointing up, lean your body forwards, count to 10' },
      step14: { title: '左腿向前迈一步', description: 'Step 14: Left leg, take a step to the front, raise the heel. Toes pointing up, lean your body forwards, count to 10' },
      step15: { title: '抬右腿，转动脚踝', description: 'Step 15: Raise right leg up, rotate ankle in circle motion, count to 10' },
      step16: { title: '抬左腿，转动脚踝', description: 'Step 16: Raise left leg up, rotate ankle in circle motion, count to 10' },
    },
  },
};
