const API_URL = 'http://127.0.0.1:3000';

export interface RankingItem {
  id: number;
  name: string;
  score: number;
}

export async function fetchRanking(): Promise<RankingItem[]> {
  try {
    console.log('Début de récupération du classement...');
    
    const response = await fetch(`${API_URL}/ranking`);
    
    console.log('Réponse reçue:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error(`Erreur HTTP: ${response.status} ${response.statusText}`);
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const rawData = await response.text();
    console.log('Données brutes reçues:', rawData);
    
    let data: any[] = [];
    try {
      data = JSON.parse(rawData);
      console.log('Données parsées:', data);
    } catch (jsonError) {
      console.error('Erreur lors du parsing JSON:', jsonError);
      throw new Error('Format de réponse invalide');
    }
    
    if (!Array.isArray(data)) {
      console.error('Les données ne forment pas un tableau:', data);
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
    
    console.log('Données normalisées:', normalizedData);
    
    return normalizedData.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Erreur lors de la récupération du classement:', error);
    throw error;
  }
}

export async function addPlayerToRanking(name: string, score: number): Promise<RankingItem> {
  try {
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
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'ajout du joueur au classement:', error);
    throw error;
  }
}