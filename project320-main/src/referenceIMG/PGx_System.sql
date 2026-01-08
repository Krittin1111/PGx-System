-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.AuditLog (
  Log_ID character varying NOT NULL,
  User_Name character varying NOT NULL,
  Action character varying,
  Table_Name character varying,
  Record_ID character varying,
  Description character varying,
  Timestamp timestamp without time zone,
  IP_Address character varying,
  CONSTRAINT AuditLog_pkey PRIMARY KEY (Log_ID)
);
CREATE TABLE public.Drug (
  Drug_ID character varying NOT NULL,
  Drug_Name character varying,
  Atc_Code character varying,
  Rxnorm_ID character varying NOT NULL UNIQUE,
  Created_At timestamp without time zone,
  Updated_At timestamp without time zone,
  CONSTRAINT Drug_pkey PRIMARY KEY (Drug_ID),
  CONSTRAINT Drug_Drug_ID_fkey FOREIGN KEY (Drug_ID) REFERENCES public.Recommendation(Drug_ID)
);
CREATE TABLE public.Employee (
  EmployeeID character varying NOT NULL,
  Firstname character varying,
  Lastname character varying,
  Email character varying NOT NULL UNIQUE,
  Password character varying,
  Dateregister date,
  Lastlogin timestamp without time zone,
  Role character varying,
  Dept character varying,
  CONSTRAINT Employee_pkey PRIMARY KEY (EmployeeID),
  CONSTRAINT Employee_Email_fkey FOREIGN KEY (Email) REFERENCES public.Restoredpassword(Email)
);
CREATE TABLE public.Gene (
  Gene_ID character varying NOT NULL,
  Gene_Symbol character varying NOT NULL,
  Description character varying,
  Created_At timestamp without time zone,
  Updated_At timestamp without time zone,
  CONSTRAINT Gene_pkey PRIMARY KEY (Gene_ID),
  CONSTRAINT Gene_Gene_ID_fkey FOREIGN KEY (Gene_ID) REFERENCES public.Variant(Gene_ID)
);
CREATE TABLE public.LabCertification (
  Cert_ID character varying NOT NULL,
  Standard character varying,
  Certificate_No character varying NOT NULL UNIQUE,
  Authority character varying,
  Issued_Date date,
  Expiry_Date date,
  Status character varying,
  Logo_Path character varying,
  Created_At timestamp without time zone,
  Updated_At timestamp without time zone,
  CONSTRAINT LabCertification_pkey PRIMARY KEY (Cert_ID)
);
CREATE TABLE public.Patient (
  Patient_ID character varying NOT NULL,
  IDCardNumber character varying NOT NULL UNIQUE,
  Name character varying,
  Age character varying,
  DateOfBirth date,
  Gender character varying,
  PhoneNumber character varying,
  Ethnicity character varying,
  Weight double precision,
  Height double precision,
  Created_At timestamp without time zone,
  Updated_At timestamp without time zone,
  CONSTRAINT Patient_pkey PRIMARY KEY (Patient_ID),
  CONSTRAINT Patient_Patient_ID_fkey FOREIGN KEY (Patient_ID) REFERENCES public.Specimen(Patient_ID)
);
CREATE TABLE public.Phenotype (
  Phenotype_ID character varying NOT NULL,
  Description character varying NOT NULL,
  Created_At timestamp without time zone,
  Updated_At timestamp without time zone,
  CONSTRAINT Phenotype_pkey PRIMARY KEY (Phenotype_ID),
  CONSTRAINT Phenotype_Phenotype_ID_fkey FOREIGN KEY (Phenotype_ID) REFERENCES public.TestResult(Phenotype_ID),
  CONSTRAINT Phenotype_Phenotype_ID_fkey1 FOREIGN KEY (Phenotype_ID) REFERENCES public.Recommendation(Phenotype_ID)
);
CREATE TABLE public.Recommendation (
  Rec_ID character varying NOT NULL,
  Phenotype_ID character varying NOT NULL UNIQUE,
  Drug_ID character varying NOT NULL UNIQUE,
  Text_Recommendation character varying,
  Source character varying,
  Created_At timestamp without time zone,
  Updated_At timestamp without time zone,
  CONSTRAINT Recommendation_pkey PRIMARY KEY (Rec_ID),
  CONSTRAINT Recommendation_Rec_ID_fkey FOREIGN KEY (Rec_ID) REFERENCES public.Reference(Rec_ID)
);
CREATE TABLE public.Reference (
  Ref_ID character varying NOT NULL,
  Rec_ID character varying NOT NULL UNIQUE,
  Doi character varying,
  Pubmed_ID character varying NOT NULL UNIQUE,
  Created_At timestamp without time zone,
  Updated_At timestamp without time zone,
  CONSTRAINT Reference_pkey PRIMARY KEY (Ref_ID)
);
CREATE TABLE public.Restoredpassword (
  Email character varying NOT NULL,
  VerifyOTP character varying,
  CreatedAt timestamp without time zone,
  ExpiresAt timestamp without time zone,
  OTP character varying,
  OTP_Expire timestamp without time zone,
  CONSTRAINT Restoredpassword_pkey PRIMARY KEY (Email)
);
CREATE TABLE public.Specimen (
  Specimen_ID character varying NOT NULL,
  Patient_ID character varying NOT NULL UNIQUE,
  Specimen_Type character varying,
  Volume_Min double precision,
  Container character varying,
  Transport_Temperature character varying,
  Submit_Date timestamp without time zone,
  Submitted_By_Unit character varying,
  Doctor_Name character varying,
  Chain_Of_Custody character varying,
  Status character varying,
  Reject_Reason character varying,
  Barcode_Internal character varying,
  Created_At timestamp without time zone,
  Updated_At timestamp without time zone,
  CONSTRAINT Specimen_pkey PRIMARY KEY (Specimen_ID),
  CONSTRAINT Specimen_Specimen_ID_fkey FOREIGN KEY (Specimen_ID) REFERENCES public.Test_Heredity(Specimen_ID)
);
CREATE TABLE public.TestResult (
  Result_ID character varying NOT NULL,
  Test_ID character varying NOT NULL UNIQUE,
  Variant_ID character varying NOT NULL UNIQUE,
  Genotype_Value character varying,
  Phenotype_ID character varying NOT NULL UNIQUE,
  Interpretation_Text character varying,
  Status character varying,
  Reviewed_By character varying,
  Reviewed_Date date,
  Created_At timestamp without time zone,
  Updated_At timestamp without time zone,
  CONSTRAINT TestResult_pkey PRIMARY KEY (Result_ID)
);
CREATE TABLE public.Test_Heredity (
  Test_ID character varying NOT NULL,
  Specimen_ID character varying NOT NULL UNIQUE,
  Test_Code character varying,
  Test_Name character varying,
  Request_Date timestamp without time zone,
  Report_Date timestamp without time zone,
  Technician_Name character varying,
  Doctor_Name character varying,
  Status character varying,
  Created_At timestamp without time zone,
  Updated_At timestamp without time zone,
  CONSTRAINT Test_Heredity_pkey PRIMARY KEY (Test_ID),
  CONSTRAINT Test_Heredity_Test_ID_fkey FOREIGN KEY (Test_ID) REFERENCES public.TestResult(Result_ID)
);
CREATE TABLE public.Variant (
  Variant_ID character varying NOT NULL,
  Gene_ID character varying NOT NULL UNIQUE,
  Rs_ID character varying,
  Allele_Name character varying,
  Nucleotide_Change character varying,
  Amino_Acid_Change character varying,
  Created_At timestamp without time zone,
  Updated_At timestamp without time zone,
  CONSTRAINT Variant_pkey PRIMARY KEY (Variant_ID),
  CONSTRAINT Variant_Variant_ID_fkey FOREIGN KEY (Variant_ID) REFERENCES public.TestResult(Variant_ID)
);