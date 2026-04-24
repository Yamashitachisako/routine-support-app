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

  rewardGameTitle: string;
  rewardGameSubtitle: string;
  rewardYatta: string;
  rewardBackToHome: string;
  rewardStar: string;
  rewardBalloon: string;
  rewardFruit: string;
  rewardFish: string;
  rewardPresent: string;

  rewardGuideTitle: string;
  rewardGuideLine1: string;
  rewardGuideLine2: string;
  rewardGuideLine3: string;
  rewardGuideStartButton: string;

  weeklySummaryTitle: string;
  weeklyAchievementsLine: string;
  weeklyEncouragement: string;

  howToUseGuide: string;
  settingsHelp: string;
  showOnboardingGuide: string;
}

const ja: Translation = {
    appTitle: 'ルーティンサポート',
    startRoutine: 'ルーティンを開始',
    todayProgress: '今日の進捗',
    completedTimes: '回完了',
    settings: '設定',
    enterName: 'お名前を入力してください',
    nameLabel: 'お名前',
    namePlaceholder: 'お名前',
    
    morningRoutine: 'Eye Exercise Routine',
    afternoonRoutine: 'Stretching Routine',
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

    rewardGameTitle: 'ご褒美宝箱',
    rewardGameSubtitle: '宝箱を1つタップしてね',
    rewardYatta: 'やったね！',
    rewardBackToHome: 'ホームに戻る',
    rewardStar: 'キラキラの星',
    rewardBalloon: 'カラフルな風船',
    rewardFruit: 'フルーツ',
    rewardFish: 'お魚さん',
    rewardPresent: 'プレゼント',

    rewardGuideTitle: 'ご褒美ゲーム',
    rewardGuideLine1: '宝箱を1つ選んでね',
    rewardGuideLine2: '中からご褒美が出るよ',
    rewardGuideLine3: '今日もよくがんばりました',
    rewardGuideStartButton: '宝箱にいく',

    weeklySummaryTitle: '今週のがんばり',
    weeklyAchievementsLine: '今週 {count} 回達成',
    weeklyEncouragement: '今週もがんばったね！',

    howToUseGuide: '使い方ガイド',
    settingsHelp: 'ヘルプ',
    showOnboardingGuide: '使い方ガイドを表示',
    
    morningIntroSteps: {
      intro1: { title: '白い布', description: '白い布を用意してください' },
      intro2: { title: '緑の布', description: '緑の布を用意してください' },
      intro3: { title: 'ピンクのバケツ', description: 'ピンクのバケツを用意してください' },
      intro4: { title: 'デトールスプレー', description: 'デトールスプレーを用意してください' },
    },
    
    morningSteps: {
      step1: { title: 'Wipe Down Routine – Step 1 / 9', description: 'Wipe Down Routine Step bar at the top – Step 1 / 9\nStep 1: Take white cloth\nNext button to next step' },
      step2: { title: 'Wipe Down Routine – Step 2 / 9', description: 'Wipe Down Routine Step bar at the top – Step 2 / 9\nStep 2: rinse white cloth in the pail\nBack button to return to previous step\nNext button to next step' },
      step3: { title: 'Wipe Down Routine – Step 3 / 9', description: 'Wipe Down Routine Step bar at the top – Step 3 / 9\nStep 3: Wipe table and chair\nBack button to return to previous step\nNext button to next step' },
      step4: { title: 'Wipe Down Routine – Step 4 / 9', description: 'Wipe Down Routine Step bar at the top – Step 4 / 9\nStep 4: Put white cloth in the pink pail\nBack button to return to previous step\nNext button to next step' },
      step5: { title: 'Wipe Down Routine – Step 5 / 9', description: 'Wipe Down Routine Step bar at the top – Step 5 / 9\nStep 5: Take green cloth\nBack button to return to previous step\nNext button to next step' },
      step6: { title: 'Wipe Down Routine – Step 6 / 9', description: 'Wipe Down Routine Step bar at the top – Step 6 / 9\nStep 6: Spray Dettol 2 times on green cloth\nBack button to return to previous step\nNext button to next step' },
      step7: { title: 'Wipe Down Routine – Step 7 / 9', description: 'Wipe Down Routine Step bar at the top – Step 7 / 9\nStep 7: Wipe table and chair\nBack button to return to previous step\nNext button to next step' },
      step8: { title: 'Wipe Down Routine – Step 8 / 9', description: 'Wipe Down Routine Step bar at the top – Step 8 / 9\nStep 8: Take white cloth from the pink pail\nBack button to return to previous step\nNext button to next step' },
      step9: { title: 'Wipe Down Routine – Step 9 / 9', description: 'Wipe Down Routine Step bar at the top – Step 9 / 9\nStep 9: Wash green and white cloth\nBack button to return to previous step\nNext button to next step' },
    },
    
    eyeExerciseSteps: {
      step1: { title: 'Eye Exercise – Step 1 / 9', description: 'Eye exercise Step bar at the top – Step 1 / 9\nStep 1: wash hands with soap\nNext button to next step' },
      step2: { title: 'Eye Exercise – Step 2 / 9', description: 'Eye exercise Step bar at the top – Step 2 / 9\nStep 2: dry hands with clean towel\nBack button to return to previous step\nNext button to next step' },
      step3: { title: 'Eye Exercise – Step 3 / 9', description: 'Eye exercise Step bar at the top – Step 3 / 9\nStep 3: Rub palms together to create heat\nBack button to return to previous step\nNext button to next step' },
      step4: { title: 'Eye Exercise – Step 4 / 9', description: 'Eye exercise Step bar at the top – Step 4 / 9\nStep 4: Put palms over eyes and count to 10\nBack button to return to previous step\nNext button to next step' },
      step5: { title: 'Eye Exercise – Step 5 / 9', description: 'Eye exercise Step bar at the top – Step 5 / 9\nStep 5: place fingers on the top of the nose, beside eyes\nPress and move fingers in circle movement, count to 10\nBack button to return to previous step\nNext button to next step' },
      step6: { title: 'Eye Exercise – Step 6 / 9', description: 'Eye exercise Step bar at the top – Step 6 / 9\nStep 6: Place finger in the middle of eyebrow,\nPress gently move fingers in a circle motion for 10 times\nBack button to return to previous step\nNext button to next step' },
      step7: { title: 'Eye Exercise – Step 7 / 9', description: 'Eye exercise Step bar at the top – Step 7 / 9\nStep 7: Place finger on temples, side of forehead\nPress gently, move fingers in a circle motion for 10 times\nBack button to return to previous step\nNext button to next step' },
      step8: { title: 'Eye Exercise – Step 8 / 9', description: 'Eye exercise Step bar at the top – Step 8 / 9\nStep 8: Place finger under eyes, press gently and move\nfingers in a circle motion for 10 times\nBack button to return to previous step\nNext button to next step' },
      step9: { title: 'Eye Exercise – Step 9 / 9', description: 'Eye exercise Step bar at the top – Step 9 / 9\nStep 9: Place thumb at the back of the head at the bottom\nPress gently and move fingers in a circle motion for 10 times\nBack button to return to previous step\nNext button to next step' },
    },
    
    stretchingSteps: {
      step1: { title: 'Stretching Exercise – Step 1 / 16', description: 'Stretching exercise Step bar at the top – Step 1 / 16\nStep 1: You can sit or stand\nMarch on the spot, count to 10\nNext button to next step' },
      step2: { title: 'Stretching Exercise – Step 2 / 16', description: 'Stretching exercise Step bar at the top – Step 2 / 16\nStep 2: Tilt head to the left, hold and count to 10\nBack button to return to previous step\nNext button to next step' },
      step3: { title: 'Stretching Exercise – Step 3 / 16', description: 'Stretching exercise Step bar at the top – Step 3 / 16\nStep 3: Tilt head to the right, hold and count to 10\nBack button to return to previous step\nNext button to next step' },
      step4: { title: 'Stretching Exercise – Step 4 / 16', description: 'Stretching exercise Step bar at the top – Step 4 / 16\nStep 4: Turn your head to the left, count to 10\nBack button to return to previous step\nNext button to next step' },
      step5: { title: 'Stretching Exercise – Step 5 / 16', description: 'Stretching exercise Step bar at the top – Step 5 / 16\nStep 5: Turn your head to the right, count to 10\nBack button to return to previous step\nNext button to next step' },
      step6: { title: 'Stretching Exercise – Step 6 / 16', description: 'Stretching exercise Step bar at the top – Step 6 / 16\nStep 6: Open up your arms, count to 10\nBack button to return to previous step\nNext button to next step' },
      step7: { title: 'Stretching Exercise – Step 7 / 16', description: 'Stretching exercise Step bar at the top – Step 7 / 16\nStep 7: Raise right hand, stretch over the head\nKeep arms straight and close to ears, count to 10\nBack button to return to previous step\nNext button to next step' },
      step8: { title: 'Stretching Exercise – Step 8 / 16', description: 'Stretching exercise Step bar at the top – Step 8 / 16\nStep 8: Raise left hand, stretch over the head\nKeep arms straight and close to ears, count to 10\nBack button to return to previous step\nNext button to next step' },
      step9: { title: 'Stretching Exercise – Step 9 / 16', description: 'Stretching exercise Step bar at the top – Step 9 / 16\nStep 9: Place right hand behind your neck, count to 10\nBack button to return to previous step\nNext button to next step' },
      step10: { title: 'Stretching Exercise – Step 10 / 16', description: 'Stretching exercise Step bar at the top – Step 10 / 16\nStep 10: Place left hand behind your neck, count to 10\nBack button to return to previous step\nNext button to next step' },
      step11: { title: 'Stretching Exercise – Step 11 / 16', description: 'Stretching exercise Step bar at the top – Step 11 / 16\nStep 11: Put right hand out, palm facing down\nUse left hand to push fingers down, count to 10\nBack button to return to previous step\nNext button to next step' },
      step12: { title: 'Stretching Exercise – Step 12 / 16', description: 'Stretching exercise Step bar at the top – Step 12 / 16\nStep 12: Put left hand out, palm facing down\nUse right hand to push fingers down, count to 10\nBack button to return to previous step\nNext button to next step' },
      step13: { title: 'Stretching Exercise – Step 13 / 16', description: 'Stretching exercise Step bar at the top – Step 13 / 16\nStep 13: Right leg, take a step to the front, raise the heel\nToes pointing up, lean your body forwards, count to 10\nBack button to return to previous step\nNext button to next step' },
      step14: { title: 'Stretching Exercise – Step 14 / 16', description: 'Stretching exercise Step bar at the top – Step 14 / 16\nStep 14: Left leg, take a step to the front, raise the heel\nToes pointing up, lean your body forwards, count to 10\nBack button to return to previous step\nNext button to next step' },
      step15: { title: 'Stretching Exercise – Step 15 / 16', description: 'Stretching exercise Step bar at the top – Step 15 / 16\nStep 15: Raise right leg up, rotate ankle in circle motion\ncount to 10\nBack button to return to previous step\nNext button to next step' },
      step16: { title: 'Stretching Exercise – Step 16 / 16', description: 'Stretching exercise Step bar at the top – Step 16 / 16\nStep 16: Raise left leg up, rotate ankle in circle motion\ncount to 10\nBack button to return to previous step\nNext button to next step' },
    },
};

const en: Translation = {
    appTitle: 'Routine Support',
    startRoutine: 'Start Routine',
    todayProgress: "Today's Progress",
    completedTimes: 'times completed',
    settings: 'Settings',
    enterName: 'Please enter your name',
    nameLabel: 'Name',
    namePlaceholder: 'Your Name',
    
    morningRoutine: 'Eye Exercise Routine',
    afternoonRoutine: 'Stretching Routine',
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

    rewardGameTitle: 'Treasure Chest Surprise',
    rewardGameSubtitle: 'Tap one treasure chest',
    rewardYatta: 'Great job!',
    rewardBackToHome: 'Back to Home',
    rewardStar: 'Sparkly star',
    rewardBalloon: 'Colorful balloon',
    rewardFruit: 'Fruit',
    rewardFish: 'Little fish',
    rewardPresent: 'Present',

    rewardGuideTitle: 'Treasure game',
    rewardGuideLine1: 'Pick one treasure chest',
    rewardGuideLine2: 'A surprise reward is inside',
    rewardGuideLine3: 'You did great today',
    rewardGuideStartButton: 'Go to chests',

    weeklySummaryTitle: 'This week',
    weeklyAchievementsLine: 'This week: {count} completed',
    weeklyEncouragement: 'You did great this week too!',

    howToUseGuide: 'How to use',
    settingsHelp: 'Help',
    showOnboardingGuide: 'Show Quick Start Guide',
    
    morningIntroSteps: {
      intro1: { title: 'White Cloth', description: 'Prepare the white cloth' },
      intro2: { title: 'Green Cloth', description: 'Prepare the green cloth' },
      intro3: { title: 'Pink Pail', description: 'Prepare the pink pail' },
      intro4: { title: 'Dettol Spray', description: 'Prepare the Dettol spray' },
    },
    
    morningSteps: {
      step1: { title: 'Wipe Down Routine – Step 1 / 9', description: 'Wipe Down Routine Step bar at the top – Step 1 / 9\nStep 1: Take white cloth\nNext button to next step' },
      step2: { title: 'Wipe Down Routine – Step 2 / 9', description: 'Wipe Down Routine Step bar at the top – Step 2 / 9\nStep 2: rinse white cloth in the pail\nBack button to return to previous step\nNext button to next step' },
      step3: { title: 'Wipe Down Routine – Step 3 / 9', description: 'Wipe Down Routine Step bar at the top – Step 3 / 9\nStep 3: Wipe table and chair\nBack button to return to previous step\nNext button to next step' },
      step4: { title: 'Wipe Down Routine – Step 4 / 9', description: 'Wipe Down Routine Step bar at the top – Step 4 / 9\nStep 4: Put white cloth in the pink pail\nBack button to return to previous step\nNext button to next step' },
      step5: { title: 'Wipe Down Routine – Step 5 / 9', description: 'Wipe Down Routine Step bar at the top – Step 5 / 9\nStep 5: Take green cloth\nBack button to return to previous step\nNext button to next step' },
      step6: { title: 'Wipe Down Routine – Step 6 / 9', description: 'Wipe Down Routine Step bar at the top – Step 6 / 9\nStep 6: Spray Dettol 2 times on green cloth\nBack button to return to previous step\nNext button to next step' },
      step7: { title: 'Wipe Down Routine – Step 7 / 9', description: 'Wipe Down Routine Step bar at the top – Step 7 / 9\nStep 7: Wipe table and chair\nBack button to return to previous step\nNext button to next step' },
      step8: { title: 'Wipe Down Routine – Step 8 / 9', description: 'Wipe Down Routine Step bar at the top – Step 8 / 9\nStep 8: Take white cloth from the pink pail\nBack button to return to previous step\nNext button to next step' },
      step9: { title: 'Wipe Down Routine – Step 9 / 9', description: 'Wipe Down Routine Step bar at the top – Step 9 / 9\nStep 9: Wash green and white cloth\nBack button to return to previous step\nNext button to next step' },
    },
    
    eyeExerciseSteps: {
      step1: { title: 'Eye Exercise – Step 1 / 9', description: 'Eye exercise Step bar at the top – Step 1 / 9\nStep 1: wash hands with soap\nNext button to next step' },
      step2: { title: 'Eye Exercise – Step 2 / 9', description: 'Eye exercise Step bar at the top – Step 2 / 9\nStep 2: dry hands with clean towel\nBack button to return to previous step\nNext button to next step' },
      step3: { title: 'Eye Exercise – Step 3 / 9', description: 'Eye exercise Step bar at the top – Step 3 / 9\nStep 3: Rub palms together to create heat\nBack button to return to previous step\nNext button to next step' },
      step4: { title: 'Eye Exercise – Step 4 / 9', description: 'Eye exercise Step bar at the top – Step 4 / 9\nStep 4: Put palms over eyes and count to 10\nBack button to return to previous step\nNext button to next step' },
      step5: { title: 'Eye Exercise – Step 5 / 9', description: 'Eye exercise Step bar at the top – Step 5 / 9\nStep 5: place fingers on the top of the nose, beside eyes\nPress and move fingers in circle movement, count to 10\nBack button to return to previous step\nNext button to next step' },
      step6: { title: 'Eye Exercise – Step 6 / 9', description: 'Eye exercise Step bar at the top – Step 6 / 9\nStep 6: Place finger in the middle of eyebrow,\nPress gently move fingers in a circle motion for 10 times\nBack button to return to previous step\nNext button to next step' },
      step7: { title: 'Eye Exercise – Step 7 / 9', description: 'Eye exercise Step bar at the top – Step 7 / 9\nStep 7: Place finger on temples, side of forehead\nPress gently, move fingers in a circle motion for 10 times\nBack button to return to previous step\nNext button to next step' },
      step8: { title: 'Eye Exercise – Step 8 / 9', description: 'Eye exercise Step bar at the top – Step 8 / 9\nStep 8: Place finger under eyes, press gently and move\nfingers in a circle motion for 10 times\nBack button to return to previous step\nNext button to next step' },
      step9: { title: 'Eye Exercise – Step 9 / 9', description: 'Eye exercise Step bar at the top – Step 9 / 9\nStep 9: Place thumb at the back of the head at the bottom\nPress gently and move fingers in a circle motion for 10 times\nBack button to return to previous step\nNext button to next step' },
    },
    
    stretchingSteps: {
      step1: { title: 'Stretching Exercise – Step 1 / 16', description: 'Stretching exercise Step bar at the top – Step 1 / 16\nStep 1: You can sit or stand\nMarch on the spot, count to 10\nNext button to next step' },
      step2: { title: 'Stretching Exercise – Step 2 / 16', description: 'Stretching exercise Step bar at the top – Step 2 / 16\nStep 2: Tilt head to the left, hold and count to 10\nBack button to return to previous step\nNext button to next step' },
      step3: { title: 'Stretching Exercise – Step 3 / 16', description: 'Stretching exercise Step bar at the top – Step 3 / 16\nStep 3: Tilt head to the right, hold and count to 10\nBack button to return to previous step\nNext button to next step' },
      step4: { title: 'Stretching Exercise – Step 4 / 16', description: 'Stretching exercise Step bar at the top – Step 4 / 16\nStep 4: Turn your head to the left, count to 10\nBack button to return to previous step\nNext button to next step' },
      step5: { title: 'Stretching Exercise – Step 5 / 16', description: 'Stretching exercise Step bar at the top – Step 5 / 16\nStep 5: Turn your head to the right, count to 10\nBack button to return to previous step\nNext button to next step' },
      step6: { title: 'Stretching Exercise – Step 6 / 16', description: 'Stretching exercise Step bar at the top – Step 6 / 16\nStep 6: Open up your arms, count to 10\nBack button to return to previous step\nNext button to next step' },
      step7: { title: 'Stretching Exercise – Step 7 / 16', description: 'Stretching exercise Step bar at the top – Step 7 / 16\nStep 7: Raise right hand, stretch over the head\nKeep arms straight and close to ears, count to 10\nBack button to return to previous step\nNext button to next step' },
      step8: { title: 'Stretching Exercise – Step 8 / 16', description: 'Stretching exercise Step bar at the top – Step 8 / 16\nStep 8: Raise left hand, stretch over the head\nKeep arms straight and close to ears, count to 10\nBack button to return to previous step\nNext button to next step' },
      step9: { title: 'Stretching Exercise – Step 9 / 16', description: 'Stretching exercise Step bar at the top – Step 9 / 16\nStep 9: Place right hand behind your neck, count to 10\nBack button to return to previous step\nNext button to next step' },
      step10: { title: 'Stretching Exercise – Step 10 / 16', description: 'Stretching exercise Step bar at the top – Step 10 / 16\nStep 10: Place left hand behind your neck, count to 10\nBack button to return to previous step\nNext button to next step' },
      step11: { title: 'Stretching Exercise – Step 11 / 16', description: 'Stretching exercise Step bar at the top – Step 11 / 16\nStep 11: Put right hand out, palm facing down\nUse left hand to push fingers down, count to 10\nBack button to return to previous step\nNext button to next step' },
      step12: { title: 'Stretching Exercise – Step 12 / 16', description: 'Stretching exercise Step bar at the top – Step 12 / 16\nStep 12: Put left hand out, palm facing down\nUse right hand to push fingers down, count to 10\nBack button to return to previous step\nNext button to next step' },
      step13: { title: 'Stretching Exercise – Step 13 / 16', description: 'Stretching exercise Step bar at the top – Step 13 / 16\nStep 13: Right leg, take a step to the front, raise the heel\nToes pointing up, lean your body forwards, count to 10\nBack button to return to previous step\nNext button to next step' },
      step14: { title: 'Stretching Exercise – Step 14 / 16', description: 'Stretching exercise Step bar at the top – Step 14 / 16\nStep 14: Left leg, take a step to the front, raise the heel\nToes pointing up, lean your body forwards, count to 10\nBack button to return to previous step\nNext button to next step' },
      step15: { title: 'Stretching Exercise – Step 15 / 16', description: 'Stretching exercise Step bar at the top – Step 15 / 16\nStep 15: Raise right leg up, rotate ankle in circle motion\ncount to 10\nBack button to return to previous step\nNext button to next step' },
      step16: { title: 'Stretching Exercise – Step 16 / 16', description: 'Stretching exercise Step bar at the top – Step 16 / 16\nStep 16: Raise left leg up, rotate ankle in circle motion\ncount to 10\nBack button to return to previous step\nNext button to next step' },
    },
};

const zh: Translation = {
  ...en,
  appTitle: '日常训练助手',
  startRoutine: '开始训练',
  todayProgress: '今日进度',
  completedTimes: '次完成',
  settings: '设置',
  enterName: '请输入你的名字',
  nameLabel: '名字',
  namePlaceholder: '你的名字',
  morningRoutine: '眼部运动',
  afternoonRoutine: '拉伸运动',
  selectRoutineType: '选择训练',
  leaveHome: '出门',
  wipeDownRoutine: '擦拭整理',
  eyeExercise: '眼部运动',
  stretchingExercise: '拉伸运动',
  step: '步骤',
  of: '/',
  next: '下一步',
  back: '返回',
  skip: '跳过',
  pause: '暂停',
  resume: '继续',
  exitRoutine: '退出',
  exitConfirmTitle: '要退出训练吗？',
  exitConfirmMessage: '进度不会被保存。',
  cancel: '取消',
  confirm: '确定',
  finish: '完成',
  minutesShort: '分钟',
  secondsShort: '秒',
  timeRemaining: '剩余时间',
  howDoYouFeel: '现在心情怎么样？',
  veryBad: '很不好',
  bad: '不好',
  neutral: '一般',
  good: '好',
  veryGood: '很好',
  optionalComment: '留言（可选）',
  complete: '完成',
  greatJob: '真棒，',
  language: '语言',
  japanese: '日本語',
  english: 'English',
  chinese: '中文',
  about: '关于',
  version: '版本',
  history: '历史记录',
  loading: '加载中…',
  noHistory: '还没有记录',
  preparation: '准备',
  rewardGameTitle: '宝箱奖励',
  rewardGameSubtitle: '点按一个宝箱',
  rewardYatta: '做得好！',
  rewardBackToHome: '回到首页',
  rewardStar: '星星',
  rewardBalloon: '气球',
  rewardFruit: '水果',
  rewardFish: '小鱼',
  rewardPresent: '礼物',
  rewardGuideTitle: '宝箱游戏',
  rewardGuideLine1: '请选一个宝箱',
  rewardGuideLine2: '里面会有奖励哦',
  rewardGuideLine3: '今天你已经很棒了',
  rewardGuideStartButton: '去选宝箱',
  weeklySummaryTitle: '本周表现',
  weeklyAchievementsLine: '本周已完成 {count} 次',
  weeklyEncouragement: '这一周也很努力！',
  howToUseGuide: '使用说明',
  settingsHelp: '帮助',
  showOnboardingGuide: '显示使用说明',
  morningIntroSteps: {
    intro1: { title: '白布', description: '请准备白布' },
    intro2: { title: '绿布', description: '请准备绿布' },
    intro3: { title: '粉红色水桶', description: '请准备粉红色水桶' },
    intro4: { title: '消毒液喷雾', description: '请准备消毒液喷雾' },
  },
};

export const translations: Record<Language, Translation> = { ja, en, zh };
