namespace Application.Features.Registrations.GetRegistrations;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationsQueryHandler(IAppDbContext dbContext)
    : IQueryHandler<GetRegistrationsQuery, Result<GetRegistrationsResponse>>
{
    public async Task<Result<GetRegistrationsResponse>> HandleAsync(
        GetRegistrationsQuery query, CancellationToken cancellationToken = default)
    {
        var q = dbContext.Registrations.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.ParticipantName))
        {
            var name = query.ParticipantName.Trim().ToLower();
            q = q.Where(r => r.ParticipantName.ToLower().Contains(name));
        }

        if (!string.IsNullOrWhiteSpace(query.Type) &&
            Enum.TryParse<RegistrationType>(query.Type, true, out var type))
        {
            q = q.Where(r => r.RegistrationType == type);
        }

        if (!string.IsNullOrWhiteSpace(query.Status) &&
            Enum.TryParse<RegistrationStatus>(query.Status, true, out var status))
        {
            q = q.Where(r => r.Status == status);
        }

        var totalCount = await q.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize);

        var rows = await q
            .OrderByDescending(r => r.RegistrationDate)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        var items = rows.Select(r => new RegistrationItem(
            r.Id, r.RegistrationNumber, r.RegistrationDate, r.ParticipantName, r.ContactNumber,
            r.Email, r.Address, r.CarMakeModel, r.PlateNumber,
            r.RegistrationType.ToString(), r.Status.ToString(),
            r.RegistrationFee, r.AmountPaid,
            RegistrationRules.GetPaymentStatus(r.RegistrationFee, r.AmountPaid))).ToList();

        return Result<GetRegistrationsResponse>.Success(
            new GetRegistrationsResponse(items, query.Page, query.PageSize, totalCount, totalPages));
    }
}