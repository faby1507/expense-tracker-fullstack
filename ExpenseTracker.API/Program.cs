using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Configura SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=expenses.db"));

// 2. Configura CORS per React (Vite gira di default su localhost:5173)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 3. Documentazione OpenAPI Nativa di .NET 10
builder.Services.AddOpenApi();

var app = builder.Build();

// Interfaccia grafica Scalar per testare le API
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); 
}

app.UseCors("AllowReact");

// --- ENDPOINT API ---

// GET: Recupera tutte le spese
app.MapGet("/api/expenses", async (AppDbContext db) =>
    await db.Expenses.OrderByDescending(e => e.Date).ToListAsync());

// POST: Aggiunge una spesa
app.MapPost("/api/expenses", async (AppDbContext db, Expense expense) =>
{
    db.Expenses.Add(expense);
    await db.SaveChangesAsync();
    return Results.Created($"/api/expenses/{expense.Id}", expense);
});

// DELETE: Elimina una spesa
app.MapDelete("/api/expenses/{id}", async (AppDbContext db, int id) =>
{
    var expense = await db.Expenses.FindAsync(id);
    if (expense is null) return Results.NotFound();

    db.Expenses.Remove(expense);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Crea il database automatico all'avvio se non esiste
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.Run();