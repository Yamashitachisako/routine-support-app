export type Language = 'ja' | 'en' | 'zh';

interface StepContent {
  title: string;
  description: string;
}

export interface Translation {
  // Home Screen
  appTitle: string;
  startRoutine: string;
  todayProgress: string;
  completedTimes: string;
  settings: string;
  enterName: string;
  nameLabel: string;
  namePlaceholder: string;
  
  // Routine Type
  morningRoutine: string;
  afternoonRoutine: string;
  selectRoutineType: string;
  leaveHome: string;
  
  // Routine Steps
  step: string;
  of: string;
  next: string;
  skip: string;
  pause: string;
  resume: string;
  exitRoutine: string;
  exitConfirmTitle: string;
  exitConfirmMessage: string;
  cancel: string;
  confirm: string;
  
  // Timer
  minutesShort: string;
  secondsShort: string;
  timeRemaining: string;
  
  // Feedback Screen
  howDoYouFeel: string;
  veryBad: string;
  bad: string;
  neutral: string;
  good: string;
  veryGood: string;
  optionalComment: string;
  complete: string;
  greatJob: string;
  
  // Settings Screen
  language: string;
  japanese: string;
  english: string;
  chinese: string;
  about: string;
  version: string;
  
  // History Screen
  history: string;
  back: string;
  loading: string;
  noHistory: string;
  
  // Morning Routine Steps
  morningSteps: {
    step1: StepContent;
    step2: StepContent;
    step3: StepContent;
    step4: StepContent;
    step5: StepContent;
  };
  
  // Afternoon Routine Steps
  afternoonSteps: {
    step1: StepContent;
    step2: StepContent;
    step3: StepContent;
    step4: StepContent;
    step5: StepContent;
  };
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
    
    step: 'ステップ',
    of: '/',
    next: '次へ',
    skip: 'スキップ',
    pause: '一時停止',
    resume: '再開',
    exitRoutine: '終了',
    exitConfirmTitle: 'ルーティンを終了しますか?',
    exitConfirmMessage: '進捗は保存されません。',
    cancel: 'キャンセル',
    confirm: '確認',
    
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
    back: '戻る',
    loading: '読み込み中...',
    noHistory: 'まだ記録がありません',
    
    morningSteps: {
      step1: {
        title: '起きる',
        description: '目を覚まして、ベッドから起き上がりましょう。新しい一日の始まりです！',
      },
      step2: {
        title: '顔を洗う・歯磨きをする',
        description: '洗面所で顔を洗って、歯を磨きましょう。気持ちよくスッキリ！',
      },
      step3: {
        title: '朝ごはんを食べる',
        description: '栄養のある朝食を食べて、元気をチャージしましょう。',
      },
      step4: {
        title: '服を着替える',
        description: '今日の服に着替えて、準備を整えましょう。',
      },
      step5: {
        title: 'カバン・荷物の準備',
        description: '必要なものをカバンに入れて、忘れ物がないか確認しましょう。',
      },
    },
    
    afternoonSteps: {
      step1: {
        title: '入室時の手洗い',
        description: '石鹸を使って、手のひら、手の甲、指の間、爪の下をしっかり洗いましょう。少なくとも20秒間洗い流してください。',
      },
      step2: {
        title: '目の体操',
        description: '座って、目の体操を行いましょう。目の疲れを和らげ、視力を保護します。',
      },
      step3: {
        title: '休憩・水分補給',
        description: 'リラックスして深呼吸をしましょう。コップ1杯の水を飲んで、体に水分を補給してください。',
      },
      step4: {
        title: 'ストレッチ運動',
        description: 'ストレッチを行いましょう。筋肉をほぐし、柔軟性を高めます。',
      },
      step5: {
        title: 'クールダウン',
        description: '深呼吸をして心拍数を整えましょう。リラックスしてルーティンを終了します。',
      },
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
    
    step: 'Step',
    of: 'of',
    next: 'Next',
    skip: 'Skip',
    pause: 'Pause',
    resume: 'Resume',
    exitRoutine: 'Exit',
    exitConfirmTitle: 'Exit routine?',
    exitConfirmMessage: 'Your progress will not be saved.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    
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
    greatJob: 'Great job, ',
    
    language: 'Language',
    japanese: '日本語',
    english: 'English',
    chinese: '中文',
    about: 'About',
    version: 'Version',
    
    history: 'History',
    back: 'Back',
    loading: 'Loading...',
    noHistory: 'No records yet',
    
    morningSteps: {
      step1: {
        title: 'Wake Up',
        description: 'Open your eyes and get out of bed. A new day begins!',
      },
      step2: {
        title: 'Wash Face & Brush Teeth',
        description: 'Go to the bathroom, wash your face, and brush your teeth. Feel refreshed!',
      },
      step3: {
        title: 'Eat Breakfast',
        description: 'Have a nutritious breakfast to charge up your energy.',
      },
      step4: {
        title: 'Get Dressed',
        description: 'Change into your clothes for today and get ready.',
      },
      step5: {
        title: 'Prepare Your Bag',
        description: 'Put everything you need in your bag and check for forgotten items.',
      },
    },
    
    afternoonSteps: {
      step1: {
        title: 'Wash Hands',
        description: 'Use soap to thoroughly wash your palms, backs of hands, between fingers, and under nails. Rinse for at least 20 seconds.',
      },
      step2: {
        title: 'Eye Exercises',
        description: 'Sit comfortably and perform eye exercises. This helps relieve eye strain and protect your vision.',
      },
      step3: {
        title: 'Rest & Hydrate',
        description: 'Relax and take deep breaths. Drink a glass of water to stay hydrated.',
      },
      step4: {
        title: 'Stretching',
        description: 'Perform stretching exercises. This helps loosen muscles and improve flexibility.',
      },
      step5: {
        title: 'Cool Down',
        description: 'Take deep breaths and let your heart rate settle. Relax and finish the routine.',
      },
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
    
    step: '步骤',
    of: '/',
    next: '下一步',
    skip: '跳过',
    pause: '暂停',
    resume: '继续',
    exitRoutine: '退出',
    exitConfirmTitle: '退出日常?',
    exitConfirmMessage: '您的进度将不会被保存。',
    cancel: '取消',
    confirm: '确认',
    
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
    back: '返回',
    loading: '加载中...',
    noHistory: '还没有记录',
    
    morningSteps: {
      step1: {
        title: '起床',
        description: '睁开眼睛，从床上起来。新的一天开始了！',
      },
      step2: {
        title: '洗脸刷牙',
        description: '去洗手间洗脸刷牙，让自己清爽起来！',
      },
      step3: {
        title: '吃早餐',
        description: '吃一顿营养丰富的早餐，为身体充电。',
      },
      step4: {
        title: '换衣服',
        description: '换上今天的衣服，做好准备。',
      },
      step5: {
        title: '准备书包',
        description: '把需要的东西放进书包，检查有没有遗漏。',
      },
    },
    
    afternoonSteps: {
      step1: {
        title: '洗手',
        description: '用肥皂彻底清洗手掌、手背、手指间和指甲下。至少冲洗20秒。',
      },
      step2: {
        title: '眼保健操',
        description: '舒适地坐下,进行眼保健操。这有助于缓解眼睛疲劳并保护视力。',
      },
      step3: {
        title: '休息喝水',
        description: '放松并深呼吸。喝一杯水以保持身体水分。',
      },
      step4: {
        title: '拉伸运动',
        description: '进行拉伸运动。这有助于放松肌肉并提高柔韧性。',
      },
      step5: {
        title: '放松运动',
        description: '深呼吸,让心率平稳下来。放松并结束日常运动。',
      },
    },
  },
};
