namespace Application.Features.Registrations;

using Domain.Enums;

public static class RegistrationRules
{
    public static decimal GetFee(RegistrationType type) => type switch
    {
        RegistrationType.Exhibitor => 1500m,
        RegistrationType.Competitor => 2500m,
        RegistrationType.VIP => 5000m,
        _ => 0m
    };

    public static string GetPaymentStatus(decimal fee, decimal amountPaid)
    {
        if (amountPaid <= 0) return "Unpaid";
        return amountPaid >= fee ? "Paid" : "Partial";
    }
}