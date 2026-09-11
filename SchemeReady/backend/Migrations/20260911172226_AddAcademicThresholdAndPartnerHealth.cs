using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchemeReady.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAcademicThresholdAndPartnerHealth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "MinAcademicPercentage",
                table: "Schemes",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "FundUtilizationStatus",
                table: "ChannelPartners",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NpaHealthScore",
                table: "ChannelPartners",
                type: "text",
                nullable: false,
                defaultValue: "");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MinAcademicPercentage",
                table: "Schemes");

            migrationBuilder.DropColumn(
                name: "FundUtilizationStatus",
                table: "ChannelPartners");

            migrationBuilder.DropColumn(
                name: "NpaHealthScore",
                table: "ChannelPartners");
        }
    }
}
