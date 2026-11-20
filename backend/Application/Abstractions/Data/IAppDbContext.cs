namespace Application.Abstractions.Data;

using Domain.Entities;

using Microsoft.EntityFrameworkCore;

public interface IAppDbContext
{
    // Add a DbSet<TEntity> property for each entity in Domain/Entities
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    DbSet<Registration> Registrations { get; }
}
