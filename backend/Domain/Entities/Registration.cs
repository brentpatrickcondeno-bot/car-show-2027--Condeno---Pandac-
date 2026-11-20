namespace Domain.Entities;

using Domain.Common;
using Domain.Enums;

public sealed class Registration : BaseEntity
{
    public string RegistrationNumber { get; set; } = default!;   // CS27-0001 set by server
    public DateTime RegistrationDate { get; set; }               // UTC set by server
    public string ParticipantName { get; set; } = default!;
    public string ContactNumber { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Address { get; set; } = default!;
    public string CarMakeModel { get; set; } = default!;
    public string PlateNumber { get; set; } = default!;
    public RegistrationType RegistrationType { get; set; }
    public RegistrationStatus Status { get; set; } = RegistrationStatus.Pending;
    public decimal RegistrationFee { get; set; }                 // set by server from type
    public decimal AmountPaid { get; set; }
}