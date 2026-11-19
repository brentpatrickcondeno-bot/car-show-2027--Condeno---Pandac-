using System.Text.Json.Serialization;
using Api.Features.Registrations;
using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Features.Registrations.CreateRegistration;
using Application.Features.Registrations.GetRegistrationById;
using Application.Features.Registrations.GetRegistrations;
using Application.Features.Registrations.GetRegistrationSummary;
using Domain.Common;
using FluentValidation;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Application.Features.Registrations.GetRegistrationById;
using Application.Features.Registrations.GetRegistrations;
using Application.Features.Registrations.GetRegistrationSummary;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<IAppDbContext, AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Database")));

// Validators
builder.Services.AddValidatorsFromAssemblyContaining<IAppDbContext>();
builder.Services.ConfigureHttpJsonOptions(options =>options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));


// Handlers
builder.Services.AddScoped<ICommandHandler<CreateRegistrationCommand, Result<CreateRegistrationResponse>>, CreateRegistrationCommandHandler>();
builder.Services.AddScoped<IQueryHandler<GetRegistrationByIdQuery, Result<GetRegistrationByIdResponse>>, GetRegistrationByIdQueryHandler>();
builder.Services.AddScoped<IQueryHandler<GetRegistrationsQuery, Result<GetRegistrationsResponse>>, GetRegistrationsQueryHandler>();
builder.Services.AddScoped<IQueryHandler<GetRegistrationSummaryQuery, Result<GetRegistrationSummaryResponse>>, GetRegistrationSummaryQueryHandler>();

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

builder.Services.AddCors(options =>
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));

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

app.UseCors("Frontend");

// Map endpoints
app.MapRegistrationEndpoints();

app.Run();