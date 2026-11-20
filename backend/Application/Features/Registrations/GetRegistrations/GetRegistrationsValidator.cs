namespace Application.Features.Registrations.GetRegistrations;

using Domain.Enums;
using FluentValidation;

public sealed class GetRegistrationsValidator : AbstractValidator<GetRegistrationsQuery>
{
    public GetRegistrationsValidator()
    {
        RuleFor(x => x.ParticipantName).MaximumLength(150);

        RuleFor(x => x.Type)
            .Must(t => Enum.TryParse<RegistrationType>(t, true, out _))
            .When(x => !string.IsNullOrWhiteSpace(x.Type))
            .WithMessage("Type must be Exhibitor, Competitor or VIP.");

        RuleFor(x => x.Status)
            .Must(s => Enum.TryParse<RegistrationStatus>(s, true, out _))
            .When(x => !string.IsNullOrWhiteSpace(x.Status))
            .WithMessage("Status must be Pending, Confirmed, CheckedIn or Cancelled.");

        RuleFor(x => x.Page).GreaterThanOrEqualTo(1).WithMessage("Page must be 1 or more.");
        RuleFor(x => x.PageSize).InclusiveBetween(1, 50).WithMessage("PageSize must be between 1 and 50.");
    }
}