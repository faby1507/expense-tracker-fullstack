import { useState, useEffect } from 'react';
import './App.css';


const API_URL = 'http://localhost:5249/api/expenses';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Cibo');

  // 1. Carica le spese dal Backend .NET al caricamento della pagina
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error("Errore nel recupero spese:", err);
    }
  };

  // 2. Invia una nuova spesa al Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newExpense = {
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString()
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense)
      });

      if (res.ok) {
        // Pulisce il form e ricarica la lista
        setDescription('');
        setAmount('');
        fetchExpenses();
      }
    } catch (err) {
      console.error("Errore nel salvataggio:", err);
    }
  };

  // 3. Elimina una spesa
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchExpenses();
      }
    } catch (err) {
      console.error("Errore nell'eliminazione:", err);
    }
  };

  // Calcola il totale delle spese
  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>💸 Gestore Spese Personali</h1>
      
      {/* Form di Inserimento */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Descrizione (es. Spesa supermercato)" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <input 
          type="number" 
          step="0.01" 
          placeholder="Importo (€)" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '8px', fontSize: '16px' }}
        >
          <option value="Cibo">Cibo</option>
          <option value="Trasporti">Trasporti</option>
          <option value="Svago">Svago</option>
          <option value="Casa">Casa</option>
          <option value="Altro">Altro</option>
        </select>
        <button type="submit" style={{ padding: '10px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Aggiungi Spesa
        </button>
      </form>

      {/* Totale Speso */}
      <h2>Totale: € {totalAmount.toFixed(2)}</h2>

      {/* Lista Spese */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {expenses.map((expense) => (
          <li key={expense.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc' }}>
            <div>
              <strong>{expense.description}</strong> ({expense.category})
              <br />
              <small style={{ color: '#666' }}>{new Date(expense.date).toLocaleDateString()}</small>
            </div>
            <div>
              <span style={{ marginRight: '15px', fontWeight: 'bold' }}>€ {expense.amount.toFixed(2)}</span>
              <button onClick={() => handleDelete(expense.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;