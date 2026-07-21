# Expense Tracker (Full-Stack)

Un'applicazione web full-stack per la gestione delle spese personali, realizzata con **.NET 10 Web API** per il backend e **React + Vite** per il frontend.

---

## 🛠️ Tech Stack

### **Backend**
* **Framework:** .NET 10 Web API (Minimal APIs)
* **Database:** SQLite con **Entity Framework Core 9**
* **Documentazione API:** Scalar UI (migrato da Swashbuckle/Swagger)
* **ORM:** EF Core Code-First

### **Frontend**
* **Framework/Tooling:** React 19, Vite
* **Linguaggio:** JavaScript (ES6+)
* **Chiamate HTTP:** Standard Native `fetch` API

---

## 📁 Struttura del Progetto

```text
├── ExpenseTracker.API/         # Backend C# .NET 10
│   ├── Data/                  # AppDbContext per EF Core
│   ├── Models/                # Entità di dominio (Expense)
│   ├── Program.cs             # Configurazione API ed Endpoint CRUD
│   └── expenses.db            # Database SQLite (generato localmente)
│
└── expense-tracker-ui/        # Frontend React
    ├── src/
    │   ├── App.jsx            # Componente principale con logica CRUD
    │   └── index.css          # Stili dell'interfaccia
    ├── index.html
    └── package.json
