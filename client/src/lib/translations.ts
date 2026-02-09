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
      step1: { title: 'ステップ 1: 白い布を取る', description: 'Take white cloth' },
      step2: { title: 'ステップ 2: バケツで白い布をすすぐ', description: 'Rinse white cloth in the pail' },
      step3: { title: 'ステップ 3: テーブルと椅子を拭く', description: 'Wipe table and chair' },
      step4: { title: 'ステップ 4: ピンクのバケツに白い布を入れる', description: 'Put white cloth in the pink pail' },
      step5: { title: 'ステップ 5: 緑の布を取る', description: 'Take green cloth' },
      step6: { title: 'ステップ 6: 緑の布にデトールを2回スプレーする', description: 'Spray Dettol 2 times on green cloth' },
      step7: { title: 'ステップ 7: テーブルと椅子を拭く', description: 'Wipe table and chair' },
      step8: { title: 'ステップ 8: ピンクのバケツから白い布を取る', description: 'Take white cloth from the pink pail' },
      step9: { title: 'ステップ 9: 緑と白の布を洗う', description: 'Wash green and white cloth' },
    },
    
    eyeExerciseSteps: {
      step1: { title: 'ステップ 1: 石鹸で手を洗う', description: 'Wash hands with soap' },
      step2: { title: 'ステップ 2: きれいなタオルで手を拭く', description: 'Dry hands with clean towel' },
      step3: { title: 'ステップ 3: 手のひらをこすり合わせて温める', description: 'Rub palms together to create heat' },
      step4: { title: 'ステップ 4: 手のひらを目の上に置いて10数える', description: 'Put palms over eyes and count to 10' },
      step5: { title: 'ステップ 5: 鼻の上の目の横に指を置く', description: 'Place fingers on the top of the nose, beside eyes\nPress and move fingers in circle movement, count to 10' },
      step6: { title: 'ステップ 6: 眉毛の真ん中に指を置く', description: 'Place finger in the middle of eyebrow\nPress gently, move fingers in a circle motion for 10 times' },
      step7: { title: 'ステップ 7: こめかみに指を置く', description: 'Place finger on temples, side of forehead\nPress gently, move fingers in a circle motion for 10 times' },
      step8: { title: 'ステップ 8: 目の下に指を置く', description: 'Place finger under eyes, press gently and move\nfingers in a circle motion for 10 times' },
      step9: { title: 'ステップ 9: 頭の後ろの下部に親指を置く', description: 'Place thumb at the back of the head at the bottom\nPress gently and move fingers in a circle motion for 10 times' },
    },
    
    stretchingSteps: {
      step1: { title: 'ステップ 1: 座っても立ってもOK', description: 'You can sit or stand\nMarch on the spot, count to 10' },
      step2: { title: 'ステップ 2: 頭を左に傾ける', description: 'Tilt head to the left, hold and count to 10' },
      step3: { title: 'ステップ 3: 頭を右に傾ける', description: 'Tilt head to the right, hold and count to 10' },
      step4: { title: 'ステップ 4: 頭を左に回す', description: 'Turn your head to the left, count to 10' },
      step5: { title: 'ステップ 5: 頭を右に回す', description: 'Turn your head to the right, count to 10' },
      step6: { title: 'ステップ 6: 腕を広げる', description: 'Open up your arms, count to 10' },
      step7: { title: 'ステップ 7: 右手を上げて頭の上でストレッチ', description: 'Raise right hand, stretch over the head\nKeep arms straight and close to ears, count to 10' },
      step8: { title: 'ステップ 8: 左手を上げて頭の上でストレッチ', description: 'Raise left hand, stretch over the head\nKeep arms straight and close to ears, count to 10' },
      step9: { title: 'ステップ 9: 右手を首の後ろに置く', description: 'Place right hand behind your neck, count to 10' },
      step10: { title: 'ステップ 10: 左手を首の後ろに置く', description: 'Place left hand behind your neck, count to 10' },
      step11: { title: 'ステップ 11: 右手を出して指を下に押す', description: 'Put right hand out, palm facing down\nUse left hand to push fingers down, count to 10' },
      step12: { title: 'ステップ 12: 左手を出して指を下に押す', description: 'Put left hand out, palm facing down\nUse right hand to push fingers down, count to 10' },
      step13: { title: 'ステップ 13: 右足を前に出してかかとを上げる', description: 'Right leg, take a step to the front, raise the heel\nToes pointing up, lean your body forwards, count to 10' },
      step14: { title: 'ステップ 14: 左足を前に出してかかとを上げる', description: 'Left leg, take a step to the front, raise the heel\nToes pointing up, lean your body forwards, count to 10' },
      step15: { title: 'ステップ 15: 右足を上げて足首を回す', description: 'Raise right leg up, rotate ankle in circle motion\ncount to 10' },
      step16: { title: 'ステップ 16: 左足を上げて足首を回す', description: 'Raise left leg up, rotate ankle in circle motion\ncount to 10' },
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
      step1: { title: 'Step 1: Take white cloth', description: 'Take white cloth' },
      step2: { title: 'Step 2: Rinse white cloth in the pail', description: 'Rinse white cloth in the pail' },
      step3: { title: 'Step 3: Wipe table and chair', description: 'Wipe table and chair' },
      step4: { title: 'Step 4: Put white cloth in the pink pail', description: 'Put white cloth in the pink pail' },
      step5: { title: 'Step 5: Take green cloth', description: 'Take green cloth' },
      step6: { title: 'Step 6: Spray Dettol 2 times on green cloth', description: 'Spray Dettol 2 times on green cloth' },
      step7: { title: 'Step 7: Wipe table and chair', description: 'Wipe table and chair' },
      step8: { title: 'Step 8: Take white cloth from the pink pail', description: 'Take white cloth from the pink pail' },
      step9: { title: 'Step 9: Wash green and white cloth', description: 'Wash green and white cloth' },
    },
    
    eyeExerciseSteps: {
      step1: { title: 'Step 1: Wash hands with soap', description: 'Wash hands with soap' },
      step2: { title: 'Step 2: Dry hands with clean towel', description: 'Dry hands with clean towel' },
      step3: { title: 'Step 3: Rub palms together to create heat', description: 'Rub palms together to create heat' },
      step4: { title: 'Step 4: Put palms over eyes and count to 10', description: 'Put palms over eyes and count to 10' },
      step5: { title: 'Step 5: Place fingers on the top of the nose', description: 'Place fingers on the top of the nose, beside eyes\nPress and move fingers in circle movement, count to 10' },
      step6: { title: 'Step 6: Place finger in the middle of eyebrow', description: 'Place finger in the middle of eyebrow\nPress gently, move fingers in a circle motion for 10 times' },
      step7: { title: 'Step 7: Place finger on temples', description: 'Place finger on temples, side of forehead\nPress gently, move fingers in a circle motion for 10 times' },
      step8: { title: 'Step 8: Place finger under eyes', description: 'Place finger under eyes, press gently and move\nfingers in a circle motion for 10 times' },
      step9: { title: 'Step 9: Place thumb at back of head', description: 'Place thumb at the back of the head at the bottom\nPress gently and move fingers in a circle motion for 10 times' },
    },
    
    stretchingSteps: {
      step1: { title: 'Step 1: You can sit or stand', description: 'You can sit or stand\nMarch on the spot, count to 10' },
      step2: { title: 'Step 2: Tilt head to the left', description: 'Tilt head to the left, hold and count to 10' },
      step3: { title: 'Step 3: Tilt head to the right', description: 'Tilt head to the right, hold and count to 10' },
      step4: { title: 'Step 4: Turn head to the left', description: 'Turn your head to the left, count to 10' },
      step5: { title: 'Step 5: Turn head to the right', description: 'Turn your head to the right, count to 10' },
      step6: { title: 'Step 6: Open up your arms', description: 'Open up your arms, count to 10' },
      step7: { title: 'Step 7: Raise right hand, stretch over head', description: 'Raise right hand, stretch over the head\nKeep arms straight and close to ears, count to 10' },
      step8: { title: 'Step 8: Raise left hand, stretch over head', description: 'Raise left hand, stretch over the head\nKeep arms straight and close to ears, count to 10' },
      step9: { title: 'Step 9: Right hand behind neck', description: 'Place right hand behind your neck, count to 10' },
      step10: { title: 'Step 10: Left hand behind neck', description: 'Place left hand behind your neck, count to 10' },
      step11: { title: 'Step 11: Right hand out, push fingers down', description: 'Put right hand out, palm facing down\nUse left hand to push fingers down, count to 10' },
      step12: { title: 'Step 12: Left hand out, push fingers down', description: 'Put left hand out, palm facing down\nUse right hand to push fingers down, count to 10' },
      step13: { title: 'Step 13: Right leg step forward', description: 'Right leg, take a step to the front, raise the heel\nToes pointing up, lean your body forwards, count to 10' },
      step14: { title: 'Step 14: Left leg step forward', description: 'Left leg, take a step to the front, raise the heel\nToes pointing up, lean your body forwards, count to 10' },
      step15: { title: 'Step 15: Raise right leg, rotate ankle', description: 'Raise right leg up, rotate ankle in circle motion\ncount to 10' },
      step16: { title: 'Step 16: Raise left leg, rotate ankle', description: 'Raise left leg up, rotate ankle in circle motion\ncount to 10' },
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
      step1: { title: '步骤 1: 拿白布', description: 'Take white cloth' },
      step2: { title: '步骤 2: 在桶里冲洗白布', description: 'Rinse white cloth in the pail' },
      step3: { title: '步骤 3: 擦桌椅', description: 'Wipe table and chair' },
      step4: { title: '步骤 4: 把白布放进粉色桶里', description: 'Put white cloth in the pink pail' },
      step5: { title: '步骤 5: 拿绿布', description: 'Take green cloth' },
      step6: { title: '步骤 6: 在绿布上喷2次滴露', description: 'Spray Dettol 2 times on green cloth' },
      step7: { title: '步骤 7: 擦桌椅', description: 'Wipe table and chair' },
      step8: { title: '步骤 8: 从粉色桶里拿出白布', description: 'Take white cloth from the pink pail' },
      step9: { title: '步骤 9: 洗绿布和白布', description: 'Wash green and white cloth' },
    },
    
    eyeExerciseSteps: {
      step1: { title: '步骤 1: 用肥皂洗手', description: 'Wash hands with soap' },
      step2: { title: '步骤 2: 用干净毛巾擦手', description: 'Dry hands with clean towel' },
      step3: { title: '步骤 3: 搓手掌产生热量', description: 'Rub palms together to create heat' },
      step4: { title: '步骤 4: 手掌盖住眼睛数到10', description: 'Put palms over eyes and count to 10' },
      step5: { title: '步骤 5: 手指放在鼻梁上方', description: 'Place fingers on the top of the nose, beside eyes\nPress and move fingers in circle movement, count to 10' },
      step6: { title: '步骤 6: 手指放在眉毛中间', description: 'Place finger in the middle of eyebrow\nPress gently, move fingers in a circle motion for 10 times' },
      step7: { title: '步骤 7: 手指放在太阳穴', description: 'Place finger on temples, side of forehead\nPress gently, move fingers in a circle motion for 10 times' },
      step8: { title: '步骤 8: 手指放在眼下方', description: 'Place finger under eyes, press gently and move\nfingers in a circle motion for 10 times' },
      step9: { title: '步骤 9: 拇指放在后脑勺下方', description: 'Place thumb at the back of the head at the bottom\nPress gently and move fingers in a circle motion for 10 times' },
    },
    
    stretchingSteps: {
      step1: { title: '步骤 1: 原地踏步', description: 'You can sit or stand\nMarch on the spot, count to 10' },
      step2: { title: '步骤 2: 头向左倾斜', description: 'Tilt head to the left, hold and count to 10' },
      step3: { title: '步骤 3: 头向右倾斜', description: 'Tilt head to the right, hold and count to 10' },
      step4: { title: '步骤 4: 头转向左边', description: 'Turn your head to the left, count to 10' },
      step5: { title: '步骤 5: 头转向右边', description: 'Turn your head to the right, count to 10' },
      step6: { title: '步骤 6: 张开双臂', description: 'Open up your arms, count to 10' },
      step7: { title: '步骤 7: 右手举过头顶伸展', description: 'Raise right hand, stretch over the head\nKeep arms straight and close to ears, count to 10' },
      step8: { title: '步骤 8: 左手举过头顶伸展', description: 'Raise left hand, stretch over the head\nKeep arms straight and close to ears, count to 10' },
      step9: { title: '步骤 9: 右手放在脖子后面', description: 'Place right hand behind your neck, count to 10' },
      step10: { title: '步骤 10: 左手放在脖子后面', description: 'Place left hand behind your neck, count to 10' },
      step11: { title: '步骤 11: 右手伸出，向下按手指', description: 'Put right hand out, palm facing down\nUse left hand to push fingers down, count to 10' },
      step12: { title: '步骤 12: 左手伸出，向下按手指', description: 'Put left hand out, palm facing down\nUse right hand to push fingers down, count to 10' },
      step13: { title: '步骤 13: 右腿向前迈一步', description: 'Right leg, take a step to the front, raise the heel\nToes pointing up, lean your body forwards, count to 10' },
      step14: { title: '步骤 14: 左腿向前迈一步', description: 'Left leg, take a step to the front, raise the heel\nToes pointing up, lean your body forwards, count to 10' },
      step15: { title: '步骤 15: 抬右腿，转动脚踝', description: 'Raise right leg up, rotate ankle in circle motion\ncount to 10' },
      step16: { title: '步骤 16: 抬左腿，转动脚踝', description: 'Raise left leg up, rotate ankle in circle motion\ncount to 10' },
    },
  },
};
