namespace Infrastructure.Persistence;

using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

public static class DbSeeder
{
    public static async Task MigrateAndSeedAsync(
        this IServiceProvider services, CancellationToken cancellationToken = default)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await db.Database.MigrateAsync(cancellationToken);

        if (await db.Registrations.AnyAsync(cancellationToken))
        {
            return;
        }

        var names = new[]
        {
            "Juan Dela Cruz", "Maria Santos", "Pedro Reyes", "Ana Garcia", "Jose Ramos",
            "Liza Mendoza", "Carlo Bautista", "Rosa Villanueva", "Miguel Torres", "Elena Cruz",
            "Ramon Aquino", "Carmen Flores", "Dante Navarro", "Grace Castillo", "Victor Domingo",
            "Joy Fernandez", "Mark Gonzales", "Nina Rivera", "Paolo Lopez", "Sheila Morales",
            "Andres Pascual", "Bea Salazar", "Rico Valdez", "Tina Herrera", "Noel Soriano"
        };

        var cars = new[]
        {
            "Toyota Supra MK4", "Honda Civic Type R", "Nissan Skyline GT-R", "Mazda RX-7",
            "Subaru WRX STI", "Mitsubishi Lancer Evo", "Ford Mustang GT", "Chevrolet Camaro",
            "BMW M3", "Mercedes-Benz C63"
        };

        var types = new[] { RegistrationType.Exhibitor, RegistrationType.Competitor, RegistrationType.VIP };
        var statuses = new[]
        {
            RegistrationStatus.Pending, RegistrationStatus.Confirmed,
            RegistrationStatus.CheckedIn, RegistrationStatus.Cancelled
        };

        var start = new DateTime(2026, 10, 1, 8, 0, 0, DateTimeKind.Utc);
        var list = new List<Registration>();

        for (var i = 0; i < names.Length; i++)
        {
            var type = types[i % 3];
            var status = statuses[i % 4];
            var fee = type switch
            {
                RegistrationType.Exhibitor => 1500m,
                RegistrationType.Competitor => 2500m,
                _ => 5000m
            };

            // i % 3 cycles Unpaid / Partial / Paid; shifted so combinations vary
            var paid = ((i / 2) % 3) switch
            {
                0 => 0m,
                1 => fee / 2,
                _ => fee
            };

            list.Add(new Registration
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = $"CS27-{i + 1:D4}",
                RegistrationDate = start.AddHours(i * 5),
                ParticipantName = names[i],
                ContactNumber = $"0917{1000000 + i * 1111:D7}",
                Email = $"participant{i + 1}@example.com",
                Address = $"{100 + i} Rizal St., Sorsogon City",
                CarMakeModel = cars[i % cars.Length],
                PlateNumber = $"CSH {1000 + i}",
                RegistrationType = type,
                Status = status,
                RegistrationFee = fee,
                AmountPaid = paid
            });
        }

        db.Registrations.AddRange(list);
        await db.SaveChangesAsync(cancellationToken);
    }
}