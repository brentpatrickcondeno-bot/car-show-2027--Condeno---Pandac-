using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using FluentValidation;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Api.Features.Registrations;
using Application.Features.Registrations.CreateRegistration;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<IAppDbContext, AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Database")));

// Validators
builder.Services.AddValidatorsFromAssemblyContaining<IAppDbContext>();
builder.Services.ConfigureHttpJsonOptions(options =>options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));


// Handlers
// builder.Services.AddScoped<ICommandHandler<TCommand, Result<TResponse>>, TCommandHandler>();
// builder.Services.AddScoped<IQueryHandler<TQuery, Result<TResponse>>, TQueryHandler>();
builder.Services.AddScoped<ICommandHandler<CreateRegistrationCommand, Result<CreateRegistrationResponse>>, CreateRegistrationCommandHandler>();

// API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, _, _) =>
    {
        document.Info.Title = "Car Show Registration API";
        document.Info.Description = "Backend API for the Car Show 2027 registration system";
        return Task.CompletedTask;
    });
});

var app = builder.Build();

// Apply migrations on startup (seeding is added later in an idempotent seeder)
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// Root endpoint
app.MapGet("/", () => "Welcome to the Car Show Registration API! Go to /scalar/v1 for API documentation.");

// Map endpoints
app.MapRegistrationEndpoints();

app.Run();