-- =========================================================================
-- SchemeReady (Udyam Saarthi AI) - Microsoft SQL Server Database Schema
-- Compatible with MS SQL Server 2019 / 2022 / Azure SQL
-- Generated for Hackathon Submission & Enterprise Production
-- =========================================================================

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SchemeReadyDb')
BEGIN
    CREATE DATABASE SchemeReadyDb;
END
GO

USE SchemeReadyDb;
GO

-- 1. Schemes Master Table
IF OBJECT_ID('dbo.Schemes', 'U') IS NOT NULL DROP TABLE dbo.Schemes;
GO
CREATE TABLE dbo.Schemes (
    SchemeId NVARCHAR(50) NOT NULL PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    SchemeType NVARCHAR(100) NOT NULL,
    TargetGroup NVARCHAR(200) NOT NULL,
    MinimumAge INT NOT NULL DEFAULT 18,
    MaximumAge INT NOT NULL DEFAULT 60,
    IncomeLimit DECIMAL(18,2) NOT NULL,
    MinimumProjectCost DECIMAL(18,2) NOT NULL,
    MaximumProjectCost DECIMAL(18,2) NOT NULL,
    EligibleBusinessTypesJson NVARCHAR(MAX) NOT NULL,
    InterestRate DECIMAL(5,2) NOT NULL,
    MaximumTenureMonths INT NOT NULL,
    MoratoriumMonths INT NOT NULL,
    RequiredDocumentsJson NVARCHAR(MAX) NOT NULL,
    SupportedDistrictsJson NVARCHAR(MAX) NOT NULL,
    ApplicationMode NVARCHAR(50) NOT NULL,
    OfficialUrl NVARCHAR(500) NOT NULL,
    SourceDocument NVARCHAR(500) NOT NULL,
    LastVerifiedDate DATETIME2 NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Verified',
    Description NVARCHAR(MAX) NULL
);
GO

-- 2. Channel Partners Master Table (SCAs, PSBs, RRBs, NBFC-MFIs)
IF OBJECT_ID('dbo.ChannelPartners', 'U') IS NOT NULL DROP TABLE dbo.ChannelPartners;
GO
CREATE TABLE dbo.ChannelPartners (
    PartnerId NVARCHAR(50) NOT NULL PRIMARY KEY,
    InstitutionName NVARCHAR(250) NOT NULL,
    InstitutionType NVARCHAR(50) NOT NULL, -- SCA, PSB, RRB, NBFC-MFI
    District NVARCHAR(100) NOT NULL,
    State NVARCHAR(100) NOT NULL DEFAULT 'Karnataka',
    DistanceKm FLOAT NOT NULL DEFAULT 0.0,
    ContactNumber NVARCHAR(100) NOT NULL,
    ContactPerson NVARCHAR(150) NOT NULL,
    Address NVARCHAR(500) NOT NULL,
    ApplicationMode NVARCHAR(50) NOT NULL, -- Offline, Online, Hybrid
    SupportedSchemesJson NVARCHAR(MAX) NOT NULL,
    DocumentRequirementsJson NVARCHAR(MAX) NOT NULL,
    LastVerifiedDate DATETIME2 NOT NULL,
    IsOnlineSubmissionAvailable BIT NOT NULL DEFAULT 0,
    Pincode NVARCHAR(20) NOT NULL,
    Latitude FLOAT NOT NULL,
    Longitude FLOAT NOT NULL
);
GO

-- 3. Beneficiary Applications & Dossiers
IF OBJECT_ID('dbo.BeneficiaryApplications', 'U') IS NOT NULL DROP TABLE dbo.BeneficiaryApplications;
GO
CREATE TABLE dbo.BeneficiaryApplications (
    ApplicationId NVARCHAR(50) NOT NULL PRIMARY KEY,
    GeneratedDate DATETIME2 NOT NULL,
    ApplicantName NVARCHAR(150) NOT NULL,
    BusinessType NVARCHAR(100) NOT NULL,
    Location NVARCHAR(100) NOT NULL,
    ProjectCost DECIMAL(18,2) NOT NULL,
    AnnualIncome DECIMAL(18,2) NOT NULL,
    UserType NVARCHAR(50) NOT NULL,
    Category NVARCHAR(50) NOT NULL,
    HasCasteCertificate BIT NOT NULL,
    HasIncomeCertificate BIT NOT NULL,
    RequiredLoanAmount DECIMAL(18,2) NOT NULL,
    PreferredLanguage NVARCHAR(10) NOT NULL,
    SelectedSchemeId NVARCHAR(50) NOT NULL,
    SelectedSchemeName NVARCHAR(200) NOT NULL,
    AssignedPartnerId NVARCHAR(50) NULL,
    ReadinessScore INT NOT NULL DEFAULT 0,
    TrackingStatus NVARCHAR(50) NOT NULL DEFAULT 'Ready for Handoff',
    HandoffReferenceNumber NVARCHAR(100) NULL,
    FullDossierJson NVARCHAR(MAX) NOT NULL
);
GO

-- 4. Audit Log Table
IF OBJECT_ID('dbo.AuditLogs', 'U') IS NOT NULL DROP TABLE dbo.AuditLogs;
GO
CREATE TABLE dbo.AuditLogs (
    LogId INT IDENTITY(1,1) PRIMARY KEY,
    Timestamp DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    ActionType NVARCHAR(100) NOT NULL,
    EntityType NVARCHAR(100) NOT NULL,
    EntityId NVARCHAR(100) NOT NULL,
    PerformedBy NVARCHAR(100) NOT NULL,
    Details NVARCHAR(MAX) NULL
);
GO

PRINT 'SchemeReady MS SQL Server Schema Created Successfully.';
GO
