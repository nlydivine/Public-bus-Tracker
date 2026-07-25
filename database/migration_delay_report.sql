-- ==========================================
-- Migration: add delay_report table
-- Needed for USSD "Report Delay" (option 5)
-- Run this against the same database used by db.js
-- (public_transport_tracker, per root database.sql)
-- ==========================================

USE public_transport_tracker;

IF OBJECT_ID('dbo.delay_report', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.delay_report (
        report_id INT IDENTITY(1,1) PRIMARY KEY,
        route_id INT,
        phone_number VARCHAR(20),
        reported_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT FK_delay_report_route
            FOREIGN KEY (route_id)
            REFERENCES dbo.route(route_id)
    );
END;