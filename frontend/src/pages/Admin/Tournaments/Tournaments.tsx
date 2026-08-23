import './Tournaments.css';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/api/apiFetch'

interface Tournament {
  tournament_id: number
  tournament_name: string
  tournament_format: string
  tournament_status: string
  start_at: string
  end_at: string
}
export function AdminTournaments() {
  const [tournamentData, setTournamentData] = useState({
    tournament_name: '',
    tournament_description: '',
    tournament_format: '',
    tournament_status: '',
    registration_start: '',
    registration_end: '',
    start_at: '',
    end_at: ''
  });
  
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTournamentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Helper function to format date for API
  const formatDateForApi = (dateString: string) => {
    if (!dateString) return '';
    
    // The datetime-local input comes in format like: "2023-12-01T10:30"
    // We want to convert it to: "2023-12-01 10:30"
    // Just replace T with space and remove seconds
    if (dateString.includes('T')) {
      return dateString.replace('T', ' ').substring(0, 16);
    }
    
    // If it's already in the correct format, return as is
    return dateString;
  };

  // Fetch tournaments on component mount
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch('/api/tournaments', {
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.errorCode || 'Ошибка сервера');
        }
        
        console.log('Данные турниров:', data.tournaments);
        setTournaments(data.tournaments || []);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        setError('Ошибка загрузки турниров');
      }
    };

    fetchTournaments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Format date fields for API
      console.log('Before formatting:', {
        registration_start: tournamentData.registration_start,
        registration_end: tournamentData.registration_end,
        start_at: tournamentData.start_at,
        end_at: tournamentData.end_at
      });
      
      const formattedData = {
        ...tournamentData,
        registration_start: formatDateForApi(tournamentData.registration_start),
        registration_end: formatDateForApi(tournamentData.registration_end),
        start_at: formatDateForApi(tournamentData.start_at),
        end_at: formatDateForApi(tournamentData.end_at)
      };

      console.log('After formatting:', formattedData);

      const response = await apiFetch<{ tournament_id: number }>('/api/admin/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      // apiFetch уже обработала ошибки, если здесь - значит успешно
      const newTournament = {
        ...tournamentData,
        tournament_id: response.tournament_id,
        registration_start: formattedData.registration_start,
        registration_end: formattedData.registration_end,
        start_at: formattedData.start_at,
        end_at: formattedData.end_at,
        created_at: new Date().toISOString()
      };
      
      setTournaments(prev => [newTournament, ...prev]);
      setMessage({ type: 'success', text: 'Турнир успешно создан' });
      setTournamentData({
        tournament_name: '',
        tournament_description: '',
        tournament_format: '',
        tournament_status: '',
        registration_start: '',
        registration_end: '',
        start_at: '',
        end_at: ''
      });
    } catch (error: any) {
      console.log('API Error details:', error);
      setMessage({ type: 'error', text: error.message || 'Ошибка при создании турнира' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-tournaments-page">
      <h1>Турниры</h1>
      
        <div className="tournaments-table-section">
          <h2>Список турниров</h2>
          <div className="tournaments-table-container">
            <table className="tournaments-table">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Формат</th>
                  <th>Статус</th>
                  <th>Начало</th>
                  <th>Окончание</th>
                  <th>Участники</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {tournaments.length > 0 ? (
                  tournaments.map((tournament) => (
                    <tr key={tournament.tournament_id}>
                      <td>{tournament.tournament_name}</td>
                      <td>{tournament.tournament_format}</td>
                      <td>{tournament.tournament_status}</td>
                      <td>{tournament.start_at}</td>
                      <td>{tournament.end_at}</td>
                      <td>0</td>
                      <td>
                        <button className="btn btn-secondary">Редактировать</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="empty-state">
                      Турниров пока нет.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      <div className="add-tournament-section">
        <h2>Добавить новый турнир</h2>
        <form className="add-tournament-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tournament-name">Название турнира</label>
              <input 
                type="text" 
                id="tournament-name" 
                name="tournament_name"
                className="form-input"
                placeholder="Введите название турнира"
                value={tournamentData.tournament_name}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tournament-description">Описание</label>
              <textarea 
                id="tournament-description" 
                name="tournament_description"
                className="form-input"
                placeholder="Введите описание турнира"
                rows={3}
                value={tournamentData.tournament_description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tournament-format">Формат турнира</label>
              <select 
                id="tournament-format" 
                name="tournament_format"
                className="form-select"
                value={tournamentData.tournament_format}
                onChange={handleChange}
              >
                <option value="">Выберите формат</option>
                <option value="swiss">Swiss</option>
                <option value="round_robin">Round Robin</option>
                <option value="knockout">Knockout</option>
                <option value="groups_knockout">Groups + Knockout</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tournament-status">Статус</label>
              <select 
                id="tournament-status" 
                name="tournament_status"
                className="form-select"
                value={tournamentData.tournament_status}
                onChange={handleChange}
              >
                <option value="">Выберите статус</option>
                <option value="draft">Черновик</option>
                <option value="registration">Регистрация</option>
                <option value="upcoming">Запланирован</option>
                <option value="active">Идет сейчас</option>
                <option value="finished">Завершен</option>
                <option value="cancelled">Отменен</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="registration-start">Дата и время начала регистрации</label>
              <input 
                type="datetime-local" 
                id="registration-start" 
                name="registration_start"
                className="form-input"
                value={tournamentData.registration_start}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="registration-end">Дата и время окончания регистрации</label>
              <input 
                type="datetime-local" 
                id="registration-end" 
                name="registration_end"
                className="form-input"
                value={tournamentData.registration_end}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tournament-start">Дата и время начала турнира</label>
              <input 
                type="datetime-local" 
                id="tournament-start" 
                name="start_at"
                className="form-input"
                value={tournamentData.start_at}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tournament-end">Дата и время окончания турнира</label>
              <input 
                type="datetime-local" 
                id="tournament-end" 
                name="end_at"
                className="form-input"
                value={tournamentData.end_at}
                onChange={handleChange}
              />
            </div>
          </div>

          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Создание...' : 'Создать турнир'}
          </button>
        </form>
      </div>
    </div>
  );
}