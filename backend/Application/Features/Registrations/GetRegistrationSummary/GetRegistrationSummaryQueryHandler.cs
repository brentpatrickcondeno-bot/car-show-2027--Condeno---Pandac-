namespace Application.Features.Registrations.GetRegistrationSummary;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationSummaryQueryHandler(IAppDbContext dbContext)
    : IQueryHandler<GetRegistrationSummaryQuery, Result<GetRegistrationSummaryResponse>>
{
    public async Task<Result<GetRegistrationSummaryResponse>> HandleAsync(
        GetRegistrationSummaryQuery query, CancellationToken cancellationToken = default)
    {
        var all = dbContext.Registrations.AsNoTracking();

        var total = await all.CountAsync(cancellationToken);
        var confirmed = await all.CountAsync(r => r.Status == RegistrationStatus.Confirmed, cancellationToken);
        var checkedIn = await all.CountAsync(r => r.Status == RegistrationStatus.CheckedIn, cancellationToken);
        var pending = await all.CountAsync(r => r.Status == RegistrationStatus.Pending, cancellationToken);
        var cancelled = await all.CountAsync(r => r.Status == RegistrationStatus.Cancelled, cancellationToken);

        // Cancelled registrations are excluded from the money totals
        var active = all.Where(r => r.Status != RegistrationStatus.Cancelled);
        var totalFees = (decimal)(await active.SumAsync(r => (double?)r.RegistrationFee, cancellationToken) ?? 0);
        var totalPayments = (decimal)(await active.SumAsync(r => (double?)r.AmountPaid, cancellationToken) ?? 0);

        return Result<GetRegistrationSummaryResponse>.Success(new GetRegistrationSummaryResponse(
            total, confirmed, checkedIn, pending, cancelled,
            totalFees, totalPayments, totalFees - totalPayments));
    }
}