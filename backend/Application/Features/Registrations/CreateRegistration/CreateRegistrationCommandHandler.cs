namespace Application.Features.Registrations.CreateRegistration;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class CreateRegistrationCommandHandler(IAppDbContext dbContext)
    : ICommandHandler<CreateRegistrationCommand, Result<CreateRegistrationResponse>>
{
    public async Task<Result<CreateRegistrationResponse>> HandleAsync(
        CreateRegistrationCommand command,
        CancellationToken cancellationToken = default)
    {
        var plate = command.PlateNumber.Trim();

        var plateExists = await dbContext.Registrations
            .AnyAsync(r => r.PlateNumber == plate, cancellationToken);

        if (plateExists)
        {
            return Result<CreateRegistrationResponse>.Failure(Error.Conflict(
                "Registration.Conflict",
                $"A registration with plate number '{plate}' already exists."));
        }

        // Next sequential number: CS27-0001, CS27-0002, ...
        var last = await dbContext.Registrations
            .AsNoTracking()
            .OrderByDescending(r => r.RegistrationNumber)
            .Select(r => r.RegistrationNumber)
            .FirstOrDefaultAsync(cancellationToken);

        var next = last is not null && int.TryParse(last.AsSpan(5), out var n) ? n + 1 : 1;

        var fee = RegistrationRules.GetFee(command.RegistrationType);

        var registration = new Registration
        {
            Id = Guid.NewGuid(),
            RegistrationNumber = $"CS27-{next:D4}",
            RegistrationDate = DateTime.UtcNow,
            ParticipantName = command.ParticipantName.Trim(),
            ContactNumber = command.ContactNumber.Trim(),
            Email = command.Email.Trim(),
            Address = command.Address.Trim(),
            CarMakeModel = command.CarMakeModel.Trim(),
            PlateNumber = plate,
            RegistrationType = command.RegistrationType,
            Status = RegistrationStatus.Pending,
            RegistrationFee = fee,
            AmountPaid = command.AmountPaid
        };

        dbContext.Registrations.Add(registration);

        try
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException)
        {
            // Unique index hit (two requests at once with the same plate or number)
            return Result<CreateRegistrationResponse>.Failure(Error.Conflict(
                "Registration.Conflict",
                $"A registration with plate number '{plate}' already exists."));
        }

        return Result<CreateRegistrationResponse>.Success(new CreateRegistrationResponse(
            registration.Id,
            registration.RegistrationNumber,
            registration.RegistrationDate,
            registration.ParticipantName,
            registration.ContactNumber,
            registration.Email,
            registration.Address,
            registration.CarMakeModel,
            registration.PlateNumber,
            registration.RegistrationType,
            registration.Status,
            registration.RegistrationFee,
            registration.AmountPaid,
            RegistrationRules.GetPaymentStatus(registration.RegistrationFee, registration.AmountPaid)));
    }
}