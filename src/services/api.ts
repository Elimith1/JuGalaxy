const API_URL = 'http://127.0.0.1:3000';

// Le format de l'API a été généré par CHATGPT et on a modifié pour notre jeu

export interface RankingItem {
  id: number;
  name: string;
  score: number;
}

export async function fetchRanking(): Promise<RankingItem[]> {
  const response = await fetch(`${API_URL}/ranking`);
  
  if (!response.ok) {
    throw new Error();
  }

  const rawData = await response.text();
  
  let data: any[] = [];
  try {
    data = JSON.parse(rawData);
  } catch {
    throw new Error();
  }
  
  if (!Array.isArray(data)) {
    return [];
  }
  
  const normalizedData: RankingItem[] = data.map(item => {
    return {
      id: item.id || Math.random(),
      name: item.name || 'Inconnu',
      score: typeof item.score === 'number' ? item.score : 
             (typeof item.credit === 'number' ? item.credit : 0)
    };
  });
  
  return normalizedData.sort((a, b) => b.score - a.score);
}

export async function addPlayerToRanking(name: string, score: number): Promise<RankingItem> {
  const response = await fetch(`${API_URL}/ranking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      score
    })
  });
  
  if (!response.ok) {
    throw new Error();
  }
  
  return await response.json();
}
