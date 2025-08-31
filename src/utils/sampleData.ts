import { Novel } from '../types/Novel';

// サンプル作品データ
export const sampleNovels: Novel[] = [
  {
    id: 'sample-1',
    title: '霧の街の殺人事件',
    content: '夜の霧に包まれたロンドンの街で、一人の女性が謎の死を遂げた。現場には何の手がかりも残されていない。探偵のジョン・ワトソンは、この不可解な事件の真相を追うことになる。霧の向こうに隠された真実とは...',
    author: 'シャーロック・ホームズ',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    characterCount: 8500,
    tags: ['ミステリー', '推理小説', 'ロンドン', '探偵'],
    synopsis: '霧の街ロンドンで起こった不可解な殺人事件。探偵ワトソンが真相を追うミステリー小説。'
  },
  {
    id: 'sample-2',
    title: '時計塔の秘密',
    content: 'ビッグベンの時計塔に隠された秘密。時計職人の老人が残した暗号文を解読することで、失われた財宝の場所が明らかになる。しかし、その財宝を狙う者たちも暗躍している。時間との勝負が始まる...',
    author: 'アガサ・クリスティ',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    characterCount: 9200,
    tags: ['サスペンス', '暗号', '財宝', '時計塔'],
    synopsis: 'ビッグベンの時計塔に隠された暗号文を解読し、失われた財宝を探すサスペンス小説。'
  },
  {
    id: 'sample-3',
    title: '地下鉄の記憶',
    content: '深夜の地下鉄で目撃された謎の人物。その人物は、10年前に事故で死亡したはずの女性だった。記者のサラは、この不可解な現象の真相を追うことになる。地下鉄の暗闇に隠された記憶の謎とは...',
    author: 'エドガー・アラン・ポー',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    characterCount: 8800,
    tags: ['ホラー', '超自然', '地下鉄', '記憶'],
    synopsis: '深夜の地下鉄で目撃された謎の人物を追う記者の物語。超自然現象を扱ったホラー小説。'
  },
  {
    id: 'sample-4',
    title: '古書店の謎',
    content: '古い書店で見つかった謎の本。その本を読んだ者は、必ず7日後に謎の死を遂げるという。書店の店主は、この呪いの本の秘密を知っている。しかし、彼は誰にも真実を語ろうとしない...',
    author: 'H・P・ラブクラフト',
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30'),
    characterCount: 9500,
    tags: ['ホラー', '呪い', '古書店', '超自然'],
    synopsis: '古書店で見つかった呪いの本を巡る恐怖の物語。7日後に死をもたらす本の謎を解く。'
  },
  {
    id: 'sample-5',
    title: '雨の日の証言',
    content: '雨の降る法廷で、一人の証人が不可解な証言をした。その証言は、被告の無実を証明するはずだった。しかし、証人の記憶には矛盾があり、真実が曖昧になっている。雨音に隠された真実とは...',
    author: 'ジョン・グリシャム',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    characterCount: 8900,
    tags: ['法廷ミステリー', '証言', '雨', '真実'],
    synopsis: '雨の法廷で繰り広げられる証言の謎。被告の無実を証明する証言の真実を探る法廷ミステリー。'
  }
];

// サンプルデータをlocalStorageに追加する関数
export const addSampleData = (): void => {
  const existingNovels = JSON.parse(localStorage.getItem('mystery-novels') || '[]');
  const sampleIds = sampleNovels.map(novel => novel.id);
  
  // 既存のサンプルデータを削除
  const filteredNovels = existingNovels.filter((novel: any) => !sampleIds.includes(novel.id));
  
  // サンプルデータを追加
  const allNovels = [...filteredNovels, ...sampleNovels];
  
  localStorage.setItem('mystery-novels', JSON.stringify(allNovels));
  console.log('サンプルデータを追加しました:', sampleNovels.length, '件');
};

// サンプルデータを削除する関数
export const removeSampleData = (): void => {
  const existingNovels = JSON.parse(localStorage.getItem('mystery-novels') || '[]');
  const sampleIds = sampleNovels.map(novel => novel.id);
  
  const filteredNovels = existingNovels.filter((novel: any) => !sampleIds.includes(novel.id));
  
  localStorage.setItem('mystery-novels', JSON.stringify(filteredNovels));
  console.log('サンプルデータを削除しました');
};

