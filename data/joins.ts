// data/joins.ts

export type JoinItem = {
  id: string;
  title: string;
  category: "Merge Joins";
  overview: string;
  behavior?: string;
  sas: string;
  r: string;
  details: string;

  // ── Example 1 ──
  example1Title?: string;
  example1Desc?: string;
  example1Input?: string;
  exampleSAS: string;
  exampleR: string;
  outputTable1?: string;
  outputNote1?: string;

  // ── Example 2 ──
  example2Title?: string;
  example2Desc?: string;
  example2Input?: string;
  example2SAS?: string;
  example2R?: string;
  outputTable2?: string;
  outputNote2?: string;

  // ── Watch Out ──
  watchOut?: string;

  // ── Conclusion ──
  conclusion?: string;
};

export const joinsData: JoinItem[] = [

  // ════════════════════════════════════════════════════════════
  // FULL JOIN
  // ════════════════════════════════════════════════════════════
  {
    id: "full-join",
    category: "Merge Joins",
    title: "Full Join",

    overview:
      "MERGE is used to combine observations from two or more datasets horizontally (adding columns/variables from different sources). The behaviour depends on the relationship between the datasets based on the BY variable(s).",

    behavior:
      "SAS merge in DATA step shows max(Rows_left, Rows_right) and the log will have the note \"merge by repeats\" if the rows are not unique as per the BY variables. Whereas R performs a full join and gives a Cartesian product, and also throws a warning \"Detected an unexpected many-to-many relationship between x and y\" unless the relationship is specified as many-to-many. Also, R merges without sorting the datasets by the BY variables.",

    sas: `proc sort data=LEFT;
  by SUBJID;
run;

proc sort data=RIGHT;
  by SUBJID;
run;

data FULLJOIN;
  merge LEFT RIGHT;
  by SUBJID;
run;`,

    r: `library(dplyr)

FULLJOIN <- full_join(LEFT, RIGHT, by = "SUBJID")`,

    details:
      "Full Join is used when you need to retain all records from both datasets, regardless of whether matching records exist. It returns all observations from both tables, combining matched records where possible and displaying missing values when no match is found. In clinical programming, it is commonly used when merging two different datasets to ensure that all records from both sources are preserved.",

    // ── Example 1 ──────────────────────────────────────────
    example1Title: "Example 1 — Deriving AESTDY and AEENDY",
    example1Desc:
      "We have 2 datasets: DM (Demographics) on the left and AE (Adverse Events) on the right. " +
      "To calculate the duration of AEs from the start of treatment, we merge both datasets " +
      "and derive 2 new columns: AESTDY and AEENDY.",

    example1Input: `
── Input Dataset: DM ──────────────────────────────

SUBJID    RFSTDTC
1015      2013-12-01
1023      2012-05-01
1028      2013-06-01


── Input Dataset: AE ──────────────────────────────

SUBJID    AETERM                      AESTDTC      AEENDTC
1015      APPLICATION SITE ERYTHEMA   2014-01-03   .
1015      APPLICATION SITE PRURITUS   2014-01-03   .
1015      DIARRHOEA                   2014-01-09   2014-01-11
1023      ERYTHEMA                    2012-08-07   .
1023      ERYTHEMA                    2012-08-07   2012-08-30
1028      APPLICATION SITE ERYTHEMA   2013-07-21   .
1028      APPLICATION SITE PRURITUS   2013-08-08   .
`,

    exampleSAS: `proc sort data=DM;
  by SUBJID;
run;

proc sort data=AE;
  by SUBJID;
run;

data ADAE;
  merge DE AE;
  by SUBJID;
  if AESTDTC not in ('' ' ') and RFSTDTC not in ('' ' ') then
    AESTDY = input(AESTDTC, yymmdd10.) - input(RFSTDTC, yymmdd10.) + 1;
  if AEENDTC not in ('' ' ') and RFSTDTC not in ('' ' ') then
    AEENDY = input(AEENDTC, yymmdd10.) - input(RFSTDTC, yymmdd10.) + 1;
run;`,

    exampleR: `library(dplyr)

ADAE <- full_join(DEMO, ADAE_, by = "SUBJID") %>%
  mutate(
    AESTDY = case_when(
      !is.na(AESTDTC) & !is.na(RFSTDTC) ~
        as.numeric(as.Date(AESTDTC) - as.Date(RFSTDTC)) + 1
    ),
    AEENDY = case_when(
      !is.na(AEENDTC) & !is.na(RFSTDTC) ~
        as.numeric(as.Date(AEENDTC) - as.Date(RFSTDTC)) + 1
    )
  )`,

    outputTable1: `
SUBJID    RFSTDTC      AETERM                      AESTDTC      AEENDTC      AESTDY   AEENDY
1015      2013-12-01   APPLICATION SITE ERYTHEMA   2014-01-03   .            34       .
1015      2013-12-01   APPLICATION SITE PRURITUS   2014-01-03   .            34       .
1015      2013-12-01   DIARRHOEA                   2014-01-09   2014-01-11   40       42
1023      2012-05-01   ERYTHEMA                    2012-08-07   .            99       .
1023      2012-05-01   ERYTHEMA                    2012-08-07   2012-08-30   99       122
1028      2013-06-01   APPLICATION SITE ERYTHEMA   2013-07-21   .            51       .
1028      2013-06-01   APPLICATION SITE PRURITUS   2013-08-08   .            69       .
`,

    outputNote1:
      "The output dataset is the same in both SAS and R. " +
      "In SAS, the input() function converts character dates to numeric before calculating the day difference. " +
      "In R, as.Date() converts the character date and as.numeric() converts the result. " +
      "Both produce identical AESTDY and AEENDY values.",

    // ── Example 2 ──────────────────────────────────────────
    example2Title: "Example 2 — Many-to-Many Merge Behavior",
    example2Desc:
      "This example shows the key difference between SAS and R when merging datasets that have " +
      "multiple observations for the same subject. Datasets AE and CM are merged by SUBJID.",

    example2Input: `
── Input Dataset: AE ──────────────────────────────

SUBJID    AETERM                      AESTDTC      AEENDTC
1015      APPLICATION SITE ERYTHEMA   2014-01-03   .
1015      APPLICATION SITE PRURITUS   2014-01-03   .
1015      DIARRHOEA                   2014-01-09   2014-01-11
1023      ERYTHEMA                    2012-08-07   .
1023      ERYTHEMA                    2012-08-07   2012-08-30
1023      ERYTHEMA                    2012-08-07   2012-08-30
1023      ATRIOVENTRICULAR BLOCK      2012-08-26   .
1028      APPLICATION SITE ERYTHEMA   2013-07-21   .
1028      APPLICATION SITE PRURITUS   2013-08-08   .


── Input Dataset: CM ──────────────────────────────

SUBJID    CMTRT           CMSTDTC
1015      PARACETAMOL     2013-12-15
1015      IBUPROFEN       2014-01-02
1023      METFORMIN       2012-05-10
1023      ATORVASTATIN    2012-07-20
1028      OMEPRAZOLE      2013-06-01
1028      SALBUTAMOL      2013-07-15
1033      AMLODIPINE      2014-02-05
1033      LOSARTAN        2014-03-10
1057      LEVOTHYROXINE   2015-01-20
1057      VITAMIN D       2015-04-01
`,

    example2SAS: `data AECM;
  merge AE CM;
  by SUBJID;
run;

/* To get Cartesian product like R, use PROC SQL */
proc sql;
  create table merged_cartesian as
  select COALESCE(AE.SUBJID, CM.SUBJID) as SUBJID,
         AE.AETERM,
         AE.AESTDTC,
         AE.AEENDTC,
         CM.CMTRT,
         CM.CMSTDTC
  from AE
  full join CM
  on AE.SUBJID = CM.SUBJID;
quit;`,

    example2R: `library(dplyr)

# Basic full join (throws many-to-many warning)
AECM <- full_join(AE, CM, by = "SUBJID")

# Suppress warning by specifying relationship
AECM <- full_join(AE, CM, by = "SUBJID",
                  relationship = "many-to-many")`,

    outputTable2: `
── SAS Output — max(rows_left, rows_right) per subject ────

SUBJID    AETERM                      AESTDTC      AEENDTC      CMTRT           CMSTDTC
1015      APPLICATION SITE ERYTHEMA   2014-01-03   .            PARACETAMOL     2013-12-15
1015      APPLICATION SITE PRURITUS   2014-01-03   .            IBUPROFEN       2014-01-02
1015      DIARRHOEA                   2014-01-09   2014-01-11   IBUPROFEN       2014-01-02
1023      ERYTHEMA                    2012-08-07   .            METFORMIN       2012-05-10
1023      ERYTHEMA                    2012-08-07   2012-08-30   ATORVASTATIN    2012-07-20
1023      ERYTHEMA                    2012-08-07   2012-08-30   ATORVASTATIN    2012-07-20
1023      ATRIOVENTRICULAR BLOCK      2012-08-26   .            ATORVASTATIN    2012-07-20
1028      APPLICATION SITE ERYTHEMA   2013-07-21   .            OMEPRAZOLE      2013-06-01
1028      APPLICATION SITE PRURITUS   2013-08-08   .            SALBUTAMOL      2013-07-15
1033      .                           .            .            AMLODIPINE      2014-02-05
1033      .                           .            .            LOSARTAN        2014-03-10
1057      .                           .            .            LEVOTHYROXINE   2015-01-20
1057      .                           .            .            VITAMIN D       2015-04-01



── R Output — Full Cartesian product (22 rows) ────────────

SUBJID    AETERM                      AESTDTC      AEENDTC      CMTRT           CMSTDTC
1015      APPLICATION SITE ERYTHEMA   2014-01-03   .            PARACETAMOL     2013-12-15
1015      APPLICATION SITE ERYTHEMA   2014-01-03   .            IBUPROFEN       2014-01-02
1015      APPLICATION SITE PRURITUS   2014-01-03   .            PARACETAMOL     2013-12-15
1015      APPLICATION SITE PRURITUS   2014-01-03   .            IBUPROFEN       2014-01-02
1015      DIARRHOEA                   2014-01-09   2014-01-11   PARACETAMOL     2013-12-15
1015      DIARRHOEA                   2014-01-09   2014-01-11   IBUPROFEN       2014-01-02
1023      ERYTHEMA                    2012-08-07   .            METFORMIN       2012-05-10
1023      ERYTHEMA                    2012-08-07   .            ATORVASTATIN    2012-07-20
1023      ERYTHEMA                    2012-08-07   2012-08-30   METFORMIN       2012-05-10
1023      ERYTHEMA                    2012-08-07   2012-08-30   ATORVASTATIN    2012-07-20
1023      ERYTHEMA                    2012-08-07   2012-08-30   METFORMIN       2012-05-10
1023      ERYTHEMA                    2012-08-07   2012-08-30   ATORVASTATIN    2012-07-20
1023      ATRIOVENTRICULAR BLOCK      2012-08-26   .            METFORMIN       2012-05-10
1023      ATRIOVENTRICULAR BLOCK      2012-08-26   .            ATORVASTATIN    2012-07-20
1028      APPLICATION SITE ERYTHEMA   2013-07-21   .            OMEPRAZOLE      2013-06-01
1028      APPLICATION SITE ERYTHEMA   2013-07-21   .            SALBUTAMOL      2013-07-15
1028      APPLICATION SITE PRURITUS   2013-08-08   .            OMEPRAZOLE      2013-06-01
1028      APPLICATION SITE PRURITUS   2013-08-08   .            SALBUTAMOL      2013-07-15
1033      .                           .            .            AMLODIPINE      2014-02-05
1033      .                           .            .            LOSARTAN        2014-03-10
1057      .                           .            .            LEVOTHYROXINE   2015-01-20
1057      .                           .            .            VITAMIN D       2015-04-01
`,

    outputNote2:
      "SAS produces max(rows_left, rows_right) = 3 rows for SUBJID 1015 and logs: " +
      "NOTE: MERGE statement has more than one data set with repeats of BY values. " +
      "R produces a Cartesian product = 3 x 2 = 6 rows for SUBJID 1015 and throws a warning.",


    conclusion:
      "Key Takeaway:\n" +
      "• SAS DATA step MERGE → gives max rows per subject (sequential pairing)\n" +
      "• R full_join() → gives Cartesian product (all combinations)\n" +
      "• To get the same Cartesian result as R in SAS → use PROC SQL full join\n" +
      "• Always check the SAS log for the MERGE repeat note when working with non-unique BY values",
  },

  // ════════════════════════════════════════════════════════════
// LEFT JOIN — updated section only
// Replace the existing left-join block in data/joins.ts with this
// Everything else (full-join, right-join, inner-join) stays unchanged
// ════════════════════════════════════════════════════════════
  {
    id: "left-join",
    category: "Merge Joins",
    title: "Left Join",

    overview:
      "In SAS, a Left Join is performed using the MERGE statement with the IN= option, retaining only records from the left dataset (IF A). " +
      "Where there is no match, missing values are filled in for the right side columns.",

    behavior:
  "In SAS, a Left Join is performed using the MERGE statement with the IN= option, retaining only records from the left dataset (IF A). Datasets must be pre-sorted by the key variable. " +
  "In R, left_join(x, y) treats the first argument (x) as the left dataset, returning all its rows with matching rows from y — no prior sorting is required. " +
  "Note: The join type controls which subjects are retained in the output — Left Join always keeps all subjects from the left dataset. " +
  "However, if either dataset contains multiple records per subject, the same Cartesian row multiplication behaviour applies here as described in Full Join. " +
  "The examples below use one record per subject to focus purely on the Left Join behaviour.",

    sas: `proc sort data=LEFT;
  by SUBJID;
run;

proc sort data=RIGHT;
  by SUBJID;
run;

data LEFTJOIN;
  merge LEFT(in=a) RIGHT(in=b);
  by SUBJID;
  if a;
run;`,

    r: `library(dplyr)

LEFTJOIN <- left_join(LEFT, RIGHT, by = "SUBJID")`,

    details:
      "Use a Left Join when you want to keep all records from the primary (left) dataset and bring in " +
      "matching data from the secondary dataset. Common in clinical programming when starting from ADSL " +
      "and adding AE or LB data — all subjects are kept even if they have no events.",

    // ── Example 1 ──────────────────────────────────────────
    example1Title: "Example 1 — Left Join: DM and AE",
    example1Desc:
      "We keep all subjects from DM (left). Only matching AE records are brought in. " +
      "Subjects in DM with no AE records will have missing values for AE columns.",

    example1Input: `
── Input Dataset: DM (LEFT) ───────────────────────

SUBJID    RFSTDTC
101       2023-01-01
102       2023-02-01
103       2023-03-01


── Input Dataset: AE (RIGHT) ──────────────────────

SUBJID    AESTDTC      AEENDTC
101       2023-01-05   2023-01-07
102       2023-02-03   2023-02-04
`,

    exampleSAS: `proc sort data=DM;
  by SUBJID;
run;

proc sort data=AE;
  by SUBJID;
run;

data ADAE;
  merge DM(in=a) AE(in=b);
  by SUBJID;
  if a;
run;`,

    exampleR: `library(dplyr)

ADAE <- left_join(DM, AE, by = "SUBJID")`,

    outputTable1: `
SUBJID    RFSTDTC      AESTDTC      AEENDTC
101       2023-01-01   2023-01-05   2023-01-07
102       2023-02-01   2023-02-03   2023-02-04
103       2023-03-01   .            .
`,

    outputNote1:
      "SUBJID 103 exists in DM but has no AE records. " +
      "The Left Join keeps SUBJID 103 from DM and fills AESTDTC and AEENDTC with missing values. " +
      "The result is the same in both SAS and R.",

    // ── Example 2 ──────────────────────────────────────────
    example2Title: "Example 2 — Merging More Than Two Datasets: DM, DS and EX",
   example2Desc:
  "This example demonstrates how SAS handles a merge of three datasets in a single DATA step. " +
  "DM (Demographics) has 4 subjects, DS (Disposition) has 3 subjects, and EX (Exposure) has only 2 subjects — all with one record per subject. " +
  "DM is the left dataset, so all 4 subjects from DM are retained regardless of whether they appear in DS or EX. " +
  "In R, the same result is achieved using two sequential left_join() calls chained with the pipe operator. " +
  "First, DM is joined with DS — this produces an intermediate result containing all 4 subjects from DM with matching DS records brought in. " +
  "That intermediate result is then joined with EX — bringing in the EX records for subjects that match. " +
  "At each step, the left dataset drives which subjects are retained, so all 4 subjects from DM are preserved throughout.",

    example2Input: `
── Input Dataset: DM (LEFT) — 4 subjects ──────────

SUBJID    AGE    SEX
101       45     M
102       52     F
103       38     M
104       61     F


── Input Dataset: DS — 3 subjects ─────────────────

SUBJID    DSDECOD          DSSTDTC
101       COMPLETED        2023-06-01
102       COMPLETED        2023-07-15
103       DISCONTINUED     2023-04-20


── Input Dataset: EX — 2 subjects ─────────────────

SUBJID    EXTRT       EXSTDTC
101       DRUG A      2023-01-05
102       DRUG A      2023-02-01
`,

    example2SAS: `proc sort data=DM;
  by SUBJID;
run;

proc sort data=DS;
  by SUBJID;
run;

proc sort data=EX;
  by SUBJID;
run;

data ADSL;
  merge DM(in=a) DS(in=b) EX(in=c);
  by SUBJID;
  if a;
run;`,

    example2R: `library(dplyr)

ADSL <- DM %>%
  left_join(DS, by = "SUBJID") %>%
  left_join(EX, by = "SUBJID")`,

    outputTable2: `
SUBJID    AGE    SEX    DSDECOD          DSSTDTC      EXTRT     EXSTDTC
101       45     M      COMPLETED        2023-06-01   DRUG A    2023-01-05
102       52     F      COMPLETED        2023-07-15   DRUG A    2023-02-01
103       38     M      DISCONTINUED     2023-04-20   .         .
104       61     F      .                .            .         .
`,

    outputNote2:
      "All 4 subjects from DM are retained in the output. " +
      "SUBJID 101 and 102 matched in all three datasets and have complete records. " +
      "SUBJID 103 matched in DS (DISCONTINUED) but had no EX record — EXTRT and EXSTDTC are missing. " +
      "SUBJID 104 had no match in either DS or EX — all columns from DS and EX are missing. " +
      "In SAS, all three datasets are listed in a single MERGE statement. " +
      "In R, two sequential left_join() calls are chained using the pipe operator — each join adds one dataset at a time. " +
      "The result is identical in both SAS and R.",

      watchOut: "exists",

    // ── Conclusion ──────────────────────────────────────────
    conclusion:
      "Key Takeaway:\n" +
      "• All rows from the LEFT dataset are always kept\n" +
      "• Matching rows from RIGHT are joined — non-matching RIGHT rows are dropped\n" +
      "• Missing values appear for RIGHT columns where no match is found\n" +
      "• SAS can merge more than two datasets in a single MERGE statement\n" +
      "• R chains multiple left_join() calls using the pipe operator to achieve the same result\n" +
      "• SAS requires sorting by BY variable first — R does not",
  },

  // ════════════════════════════════════════════════════════════
  // RIGHT JOIN
  // ════════════════════════════════════════════════════════════
  {
    id: "right-join",
    category: "Merge Joins",
    title: "Right Join",

    overview:
      "A Right Join returns all rows from the RIGHT dataset and only the matching rows from the LEFT dataset. " +
      "Where there is no match, missing values are filled in for the left side columns.",

    behavior:
  "In SAS, a Right Join is achieved using the MERGE statement with the IN= option, retaining only records from the right dataset (IF B). Datasets must be pre-sorted by the key variable. " +
  "In R, right_join(x, y) treats the second argument (y) as the right dataset, returning all its rows with matching rows from x — no prior sorting is required. " +
  "Note: The join type controls which subjects are retained in the output — Right Join always keeps all subjects from the right dataset. " +
  "However, if either dataset contains multiple records per subject, the same Cartesian row multiplication behaviour applies here as described in Full Join. " +
  "The examples below use one record per subject to focus purely on the Right Join behaviour.",

    sas: `proc sort data=LEFT;
  by SUBJID;
run;

proc sort data=RIGHT;
  by SUBJID;
run;

data RIGHTJOIN;
  merge LEFT RIGHT(in=b);
  by SUBJID;
  if b;
run;`,

    r: `library(dplyr)

RIGHTJOIN <- right_join(LEFT, RIGHT, by = "SUBJID")`,

    details:
      "Use a Right Join when you want to keep all records from the secondary (right) dataset. " +
      "This is less common in clinical programming but useful when the right dataset drives the analysis population.",

    example1Title: "Example — Right Join: DM and AE",
    example1Desc:
      "We keep all subjects from AE (right). Only matching DM records are brought in. " +
      "AE records with no matching DM subject will have missing values for DM columns.",

    example1Input: `
── Input Dataset: DM (LEFT) ───────────────────────

SUBJID    RFSTDTC
101       2023-01-01
102       2023-02-01


── Input Dataset: AE (RIGHT) ──────────────────────

SUBJID    AESTDTC      AEENDTC
101       2023-01-05   2023-01-07
102       2023-02-03   2023-02-04
104       2023-04-01   2023-04-03
`,

    exampleSAS: `proc sort data=DM;
  by SUBJID;
run;

proc sort data=AE;
  by SUBJID;
run;

data ADAE;
  merge DM AE(in=b);
  by SUBJID;
  if b;
run;`,

    exampleR: `library(dplyr)

ADAE <- right_join(DM, AE, by = "SUBJID")`,

    outputTable1: `
SUBJID    RFSTDTC      AESTDTC      AEENDTC
101       2023-01-01   2023-01-05   2023-01-07
102       2023-02-01   2023-02-03   2023-02-04
104       .            2023-04-01   2023-04-03
`,

    outputNote1:
      "SUBJID 104 exists in AE but has no DM record. " +
      "The Right Join keeps SUBJID 104 from AE and fills RFSTDTC with a missing value. " +
      "The result is the same in both SAS and R.",

      watchOut: "exists",

    conclusion:
      "Key Takeaway:\n" +
      "• All rows from the RIGHT dataset are always kept\n" +
      "• Matching rows from LEFT are joined — non-matching LEFT rows are dropped\n" +
      "• Missing values appear for LEFT columns where no match is found\n" +
      "• SAS requires sorting by BY variable first — R does not",
  },

  // ════════════════════════════════════════════════════════════
  // INNER JOIN
  // ════════════════════════════════════════════════════════════
  {
    id: "inner-join",
    category: "Merge Joins",
    title: "Inner Join",

    overview:
      "An Inner Join returns only rows where there is a match in BOTH datasets. " +
      "Records that do not have a match in either dataset are completely excluded from the result.",

   behavior:
  "In SAS, an Inner Join is achieved using the MERGE statement with the IN= option, retaining only records that exist in both datasets (IF A AND B). Datasets must be pre-sorted by the key variable. " +
  "In R, inner_join(x, y) returns only the rows that have a match in both datasets — no prior sorting is required. " +
  "Note: The join type controls which subjects are retained in the output — Inner Join keeps only subjects that exist in both datasets, so no missing values are introduced. " +
  "However, if either dataset contains multiple records per subject, the same Cartesian row multiplication behaviour applies here as described in Full Join. " +
  "The examples below use one record per subject to focus purely on the Inner Join behaviour.",

    sas: `proc sort data=LEFT;
  by SUBJID;
run;

proc sort data=RIGHT;
  by SUBJID;
run;

data INNERJOIN;
  merge LEFT(in=a) RIGHT(in=b);
  by SUBJID;
  if a and b;
run;`,

    r: `library(dplyr)

INNERJOIN <- inner_join(LEFT, RIGHT, by = "SUBJID")`,

    details:
      "Use an Inner Join when you only want subjects or records that exist in both datasets. " +
      "Common in clinical programming when linking ADSL to lab data where only treated subjects " +
      "with lab results are needed for the analysis.",

    example1Title: "Example — Inner Join: DM and AE",
    example1Desc:
      "Only subjects that exist in BOTH DM and AE are returned. " +
      "SUBJID 103 (DM only) and SUBJID 104 (AE only) are both excluded from the result.",

    example1Input: `
── Input Dataset: DM (LEFT) ───────────────────────

SUBJID    RFSTDTC
101       2023-01-01
102       2023-02-01
103       2023-03-01


── Input Dataset: AE (RIGHT) ──────────────────────

SUBJID    AESTDTC      AEENDTC
101       2023-01-05   2023-01-07
102       2023-02-03   2023-02-04
104       2023-04-01   2023-04-03
`,

    exampleSAS: `proc sort data=DM;
  by SUBJID;
run;

proc sort data=AE;
  by SUBJID;
run;

data ADAE;
  merge DM(in=a) AE(in=b);
  by SUBJID;
  if a and b;
run;`,

    exampleR: `library(dplyr)

ADAE <- inner_join(DM, AE, by = "SUBJID")`,

    outputTable1: `
SUBJID    RFSTDTC      AESTDTC      AEENDTC
101       2023-01-01   2023-01-05   2023-01-07
102       2023-02-01   2023-02-03   2023-02-04
`,

    outputNote1:
      "SUBJID 103 was in DM only — excluded. " +
      "SUBJID 104 was in AE only — excluded. " +
      "Only SUBJID 101 and 102 matched in both datasets and are returned. " +
      "The result is the same in both SAS and R.",

    conclusion:
      "Key Takeaway:\n" +
      "• Only rows that match in BOTH datasets are kept\n" +
      "• Rows that exist in only one dataset are completely dropped\n" +
      "• No missing values are introduced — all rows are complete matches\n" +
      "• SAS requires sorting by BY variable first — R does not",
  },


// ════════════════════════════════════════════════════════════
// ANTI JOIN
// Add this block at the end of the joinsData array in joins.ts
// ════════════════════════════════════════════════════════════
  {
    id: "anti-join",
    category: "Merge Joins",
    title: "Anti Join",

    overview:
      "An Anti Join returns only the rows from one dataset that have NO match in the other dataset. " +
      "It is the opposite of an Inner Join — instead of keeping matching records, it keeps the unmatched ones. " +
      "This is useful when you want to identify subjects or records that are missing from a dataset, " +
      "such as subjects in DM who have no AE records, or subjects in AE who were never enrolled in DM.",

    behavior:
      "In SAS, an Anti Join is performed using the MERGE statement with IN= options and a subsetting IF condition. " +
      "To keep records in the left dataset only (not in right), use IF A AND NOT B. " +
      "To keep records in the right dataset only (not in left), use IF B AND NOT A. " +
      "Both datasets must be pre-sorted by the BY variable. " +
      "In R, anti_join(x, y) returns all rows from x that have no match in y — the first argument always drives the result. " +
      "No prior sorting is required in R.",

    sas: `/* Left Anti Join — in DM but not in AE */
proc sort data=DM; by SUBJID; run;
proc sort data=AE; by SUBJID; run;

data RESULT;
  merge DM(in=a) AE(in=b);
  by SUBJID;
  if a and not b;
run;

/* Right Anti Join — in AE but not in DM */
data RESULT;
  merge DM(in=a) AE(in=b);
  by SUBJID;
  if b and not a;
run;`,

    r: `library(dplyr)

# Left Anti Join — in DM but not in AE
RESULT <- anti_join(DM, AE, by = "SUBJID")

# Right Anti Join — in AE but not in DM
RESULT <- anti_join(AE, DM, by = "SUBJID")`,

    details:
      "Anti Joins are commonly used in clinical programming for data quality checks and reconciliation. " +
      "For example, checking which subjects in ADSL have no corresponding records in ADAE, " +
      "or identifying AE records that cannot be linked back to a subject in DM. " +
      "In SAS, the IF A AND NOT B condition filters out any observation where a match was found in the right dataset. " +
      "In R, anti_join() is a dedicated function from dplyr that performs this in one clean step — " +
      "the dataset passed as the first argument is always the one being filtered.",

    // ── Example 1 ──────────────────────────────────────────
    example1Title: "Example 1 — Left Anti Join: Subjects in DM with no AE records",
    example1Desc:
      "We want to identify subjects who are enrolled in DM but have no Adverse Event records in AE. " +
      "DM has 4 subjects and AE has records for only 3 of them. " +
      "The Anti Join returns only the subject from DM that has no match in AE.",

    example1Input: `
── Input Dataset: DM ──────────────────────────────

SUBJID    AGE    SEX
101       45     M
102       52     F
103       38     M
104       61     F


── Input Dataset: AE ──────────────────────────────

SUBJID    AETERM                AESTDTC
101       HEADACHE              2023-01-05
102       NAUSEA                2023-02-03
103       DIZZINESS             2023-03-10
`,

    exampleSAS: `proc sort data=DM; by SUBJID; run;
proc sort data=AE; by SUBJID; run;

data DM_NO_AE;
  merge DM(in=a) AE(in=b);
  by SUBJID;
  if a and not b;
run;`,

    exampleR: `library(dplyr)

DM_NO_AE <- anti_join(DM, AE, by = "SUBJID")`,

    outputTable1: `
SUBJID    AGE    SEX
104       61     F
`,

    outputNote1:
      "Only SUBJID 104 is returned — this subject exists in DM but has no AE record. " +
      "SUBJID 101, 102 and 103 all had matching AE records and are excluded from the result. " +
      "Notice that only the DM columns are returned — AE columns are not included because there was no match. " +
      "The result is the same in both SAS and R.",

    // ── Example 2 ──────────────────────────────────────────
    example2Title: "Example 2 — Right Anti Join: AE records with no matching DM subject",
    example2Desc:
      "This example shows the reverse scenario — identifying AE records that cannot be linked " +
      "back to a subject in DM. This is a common data quality check in clinical programming. " +
      "AE has 4 records but SUBJID 105 does not exist in DM — this subject was never enrolled. " +
      "The Anti Join surfaces this orphan record for investigation.",

    example2Input: `
── Input Dataset: DM ──────────────────────────────

SUBJID    AGE    SEX
101       45     M
102       52     F
103       38     M


── Input Dataset: AE ──────────────────────────────

SUBJID    AETERM                AESTDTC
101       HEADACHE              2023-01-05
102       NAUSEA                2023-02-03
103       DIZZINESS             2023-03-10
105       FATIGUE               2023-04-15
`,

    example2SAS: `proc sort data=DM; by SUBJID; run;
proc sort data=AE; by SUBJID; run;

data AE_NO_DM;
  merge DM(in=a) AE(in=b);
  by SUBJID;
  if b and not a;
run;`,

    example2R: `library(dplyr)

AE_NO_DM <- anti_join(AE, DM, by = "SUBJID")`,

    outputTable2: `
SUBJID    AETERM      AESTDTC
105       FATIGUE     2023-04-15
`,

    outputNote2:
      "Only SUBJID 105 is returned — this subject has an AE record but no corresponding DM entry. " +
      "This is an orphan record and would typically be flagged as a data quality issue. " +
      "In SAS, IF B AND NOT A keeps only right-side records with no left-side match. " +
      "In R, anti_join(AE, DM) treats AE as the first argument — so AE records with no DM match are returned. " +
      "The result is the same in both SAS and R.",

    // ── Conclusion ──────────────────────────────────────────
    conclusion:
      "Key Takeaway:\n" +
      "• Anti Join returns rows from one dataset that have NO match in the other\n" +
      "• In SAS — IF A AND NOT B keeps left-only records; IF B AND NOT A keeps right-only records\n" +
      "• In R — anti_join(x, y) always filters x, keeping rows with no match in y\n" +
      "• Only columns from the driving dataset are returned — no columns from the other dataset\n" +
      "• Commonly used for data quality checks — finding orphan records or subjects missing from a dataset\n" +
      "• SAS requires sorting by BY variable first — R does not",
  },
  // ════════════════════════════════════════════════════════════
// SYMMETRIC DIFFERENCE
// Paste this block inside the joinsData array in joins.ts
// Add it after the anti-join block, before the closing ];
// ════════════════════════════════════════════════════════════
  {
    id: "symmetric-difference",
    category: "Merge Joins",
    title: "Symmetric Difference",

    overview:
      "A Symmetric Difference returns only the records that exist in ONE dataset but NOT in both. " +
      "Records that match in both datasets are excluded from the result. " +
      "It is the opposite of an Inner Join — instead of keeping only the common records, " +
      "it keeps only the uncommon ones from either side.",

    behavior:
      "In SAS, a Symmetric Difference is achieved using the MERGE statement with IN= options and the condition IF A + B = 1. " +
      "Since IN= variables are binary (0 or 1), A + B = 1 is true only when a record exists in exactly one dataset — " +
      "either left only or right only. When a record matches in both datasets, A + B = 2 and it is excluded. " +
      "Both datasets must be pre-sorted by the BY variable. " +
      "In R, there is no single dedicated function for Symmetric Difference. " +
      "It is achieved by combining two anti_join() calls with bind_rows() — " +
      "first getting left-only records, then right-only records, then stacking them together.",

    sas: `proc sort data=DM; by SUBJID; run;
proc sort data=AE; by SUBJID; run;

data RESULT;
  merge DM(in=a) AE(in=b);
  by SUBJID;
  if a + b = 1;
run;`,

    r: `library(dplyr)

left_only  <- anti_join(DM, AE, by = "SUBJID")
right_only <- anti_join(AE, DM, by = "SUBJID")

RESULT <- bind_rows(left_only, right_only)`,

    details:
      "Symmetric Difference is commonly used in clinical programming for data reconciliation and quality checks. " +
      "For example, comparing two versions of a dataset to find records that changed between snapshots, " +
      "or identifying subjects that appear in one data source but not another. " +
      "The SAS trick IF A + B = 1 is an elegant shorthand — it is equivalent to writing " +
      "IF (A AND NOT B) OR (B AND NOT A) but much more concise. " +
      "In R, since no single function exists, two anti_join() calls are combined using bind_rows() " +
      "to produce the same result.",

    // ── Example 1 ──────────────────────────────────────────
    example1Title: "Example 1 — Symmetric Difference: DM and AE",
    example1Desc:
      "DM has 4 subjects and AE has 4 records — but only SUBJID 102 and 103 exist in both. " +
      "The Symmetric Difference returns only the records that are unique to one dataset: " +
      "SUBJID 101 and 104 from DM (no AE record) and SUBJID 105 and 106 from AE (no DM record). " +
      "The common subjects 102 and 103 are excluded entirely.",

    example1Input: `
── Input Dataset: DM ──────────────────────────────

SUBJID    AGE    SEX
101       45     M
102       52     F
103       38     M
104       61     F


── Input Dataset: AE ──────────────────────────────

SUBJID    AETERM         AESTDTC
102       HEADACHE       2023-01-05
103       NAUSEA         2023-02-03
105       DIZZINESS      2023-03-10
106       FATIGUE        2023-04-15
`,

    exampleSAS: `proc sort data=DM; by SUBJID; run;
proc sort data=AE; by SUBJID; run;

data RESULT;
  merge DM(in=a) AE(in=b);
  by SUBJID;
  if a + b = 1;
run;`,

    exampleR: `library(dplyr)

left_only  <- anti_join(DM, AE, by = "SUBJID")
right_only <- anti_join(AE, DM, by = "SUBJID")

RESULT <- bind_rows(left_only, right_only)`,

    outputTable1: `
── Records from DM only (no match in AE) ──────────

SUBJID    AGE    SEX    AETERM    AESTDTC
101       45     M      .         .
104       61     F      .         .


── Records from AE only (no match in DM) ──────────

SUBJID    AGE    SEX    AETERM        AESTDTC
105       .      .      DIZZINESS     2023-03-10
106       .      .      FATIGUE       2023-04-15
`,

    outputNote1:
      "SUBJID 102 and 103 existed in both DM and AE — they are completely excluded from the result. " +
      "SUBJID 101 and 104 existed only in DM — they are kept with missing values for AE columns. " +
      "SUBJID 105 and 106 existed only in AE — they are kept with missing values for DM columns. " +
      "In SAS, all four records appear in a single output dataset because both left-only and right-only " +
      "records pass the IF A + B = 1 condition in the same DATA step. " +
      "In R, bind_rows() stacks the two anti_join() results into a single dataset. " +
      "The result is the same in both SAS and R.",

    // ── Example 2 ──────────────────────────────────────────
    example2Title: "Example 2 — Data Reconciliation: Comparing two snapshots of DM",
    example2Desc:
      "A common use case in clinical programming is comparing two versions of the same dataset " +
      "to find records that were added or removed between data cuts. " +
      "Here DM_V1 is the first snapshot and DM_V2 is the second snapshot. " +
      "The Symmetric Difference identifies subjects that were added or dropped between the two versions.",

    example2Input: `
── Input Dataset: DM_V1 (first snapshot) ──────────

SUBJID    AGE    SEX
101       45     M
102       52     F
103       38     M


── Input Dataset: DM_V2 (second snapshot) ─────────

SUBJID    AGE    SEX
102       52     F
103       38     M
104       61     F
105       29     M
`,

    example2SAS: `proc sort data=DM_V1; by SUBJID; run;
proc sort data=DM_V2; by SUBJID; run;

data CHANGES;
  merge DM_V1(in=a) DM_V2(in=b);
  by SUBJID;
  if a + b = 1;
  if a then STATUS = "Dropped in V2";
  if b then STATUS = "Added in V2";
run;`,

    example2R: `library(dplyr)

dropped <- anti_join(DM_V1, DM_V2, by = "SUBJID") %>%
  mutate(STATUS = "Dropped in V2")

added <- anti_join(DM_V2, DM_V1, by = "SUBJID") %>%
  mutate(STATUS = "Added in V2")

CHANGES <- bind_rows(dropped, added)`,

    outputTable2: `
SUBJID    AGE    SEX    STATUS
101       45     M      Dropped in V2
104       61     F      Added in V2
105       29     M      Added in V2
`,

    outputNote2:
      "SUBJID 102 and 103 existed in both snapshots — they are excluded as unchanged records. " +
      "SUBJID 101 existed only in DM_V1 — it was dropped in the second snapshot. " +
      "SUBJID 104 and 105 existed only in DM_V2 — they were added in the second snapshot. " +
      "The STATUS variable makes the output self-explanatory for review. " +
      "This pattern is very useful for audit trails and data change tracking in clinical trials. " +
      "The result is the same in both SAS and R.",

    // ── Conclusion ──────────────────────────────────────────
    conclusion:
      "Key Takeaway:\n" +
      "• Symmetric Difference keeps only records that exist in ONE dataset but NOT in both\n" +
      "• Records that match in both datasets are completely excluded\n" +
      "• In SAS — IF A + B = 1 is an elegant shorthand for IF (A AND NOT B) OR (B AND NOT A)\n" +
      "• In R — combine two anti_join() calls with bind_rows() to achieve the same result\n" +
      "• Missing values appear for columns from the dataset where no match was found\n" +
      "• Commonly used for data reconciliation, change tracking and quality checks\n" +
      "• SAS requires sorting by BY variable first — R does not",
  },
  // ════════════════════════════════════════════════════════════
// CROSS JOIN
// Paste inside joinsData array, after symmetric-difference, before ];
// ════════════════════════════════════════════════════════════
  {
    id: "cross-join",
    category: "Merge Joins",
    title: "Cross Join",

    overview:
      "A Cross Join returns every possible combination of rows from two datasets. " +
      "Every row from the left dataset is paired with every row from the right dataset — " +
      "producing a Cartesian product. No BY variable is needed. " +
      "If the left dataset has 2 rows and the right has 4 rows, the output will have 2 × 4 = 8 rows.",

    behavior:
      "In SAS, a Cross Join is performed using PROC SQL with no ON condition. " +
      "The DATA step MERGE cannot produce a true Cross Join — PROC SQL must be used. " +
      "In R, cross_join() from dplyr produces the Cartesian product directly. " +
      "There is no by= argument — all row combinations are returned automatically.",

    sas: `proc sql;
  create table RESULT as
  select *
  from LEFT, RIGHT;
quit;`,

    r: `library(dplyr)

RESULT <- cross_join(LEFT, RIGHT)`,

    details:
      "Cross Joins are commonly used in clinical programming to create expected combination shells. " +
      "For example, in a clinical trial every treatment group is expected to have data at every planned visit. " +
      "A Cross Join between a treatment lookup and a visit schedule creates all expected combinations upfront. " +
      "When actual data is merged onto this shell, any missing treatment-visit combinations " +
      "are immediately visible — rather than simply being absent from the output.",

    // ── Example 1 ──────────────────────────────────────────
    example1Title: "Example 1 — Treatment × Visit Schedule Shell",
    example1Desc:
      "In a clinical trial with 2 treatment groups and 4 planned visits, " +
      "we expect 2 × 4 = 8 treatment-visit combinations in our summary output. " +
      "A Cross Join between TRT and VISIT creates this complete shell. " +
      "Actual visit data is then left-joined onto the shell — " +
      "any combination with no data shows up clearly as missing " +
      "rather than being dropped from the output silently.",

    example1Input: `
── Input Dataset: TRT (treatment groups) ──────────

TRT
Drug A
Placebo


── Input Dataset: VISIT (planned visits) ──────────

VISIT        VISITN
Baseline     1
Week 4       2
Week 8       3
Week 12      4
`,

    exampleSAS: `/* Step 1 — Build shell using Cross Join */
proc sql;
  create table SHELL as
  select TRT.*, VISIT.*
  from TRT t, VISIT v
  order by TRT, VISITN;
quit;`,

    exampleR: `library(dplyr)

# Step 1 — Build shell using Cross Join
SHELL <- cross_join(TRT, VISIT) %>%
  arrange(TRT, VISITN)`,

    outputTable1: `
── Shell Dataset (2 × 4 = 8 rows) ────────────────

TRT        VISIT        VISITN
Drug A     Baseline     1
Drug A     Week 4       2
Drug A     Week 8       3
Drug A     Week 12      4
Placebo    Baseline     1
Placebo    Week 4       2
Placebo    Week 8       3
Placebo    Week 12      4
`,

    outputNote1:
      "The Cross Join between TRT (2 rows) and VISIT (4 rows) produces 2 × 4 = 8 shell rows — " +
      "one for every treatment and visit combination. " +
      "This shell guarantees all 8 combinations exist before any actual data is merged. " +
      "When actual visit data is left joined onto this shell, " +
      "any treatment-visit combination with no data will show as 0 or blank " +
      "rather than being silently absent from the output. " +
      "The result is the same in both SAS and R.",

    // ── Conclusion ──────────────────────────────────────────
    conclusion:
      "Key Takeaway:\n" +
      "• Cross Join returns every possible row combination — left rows × right rows\n" +
      "• No BY variable or ON condition is needed\n" +
      "• In SAS — use PROC SQL with no ON condition; DATA step MERGE cannot do a true Cross Join\n" +
      "• In R — use cross_join() from dplyr; no by= argument is needed\n" +
      "• Output rows = left dataset rows × right dataset rows\n" +
      "• Use Cross Join to build shells — ensures missing combinations appear as 0 or blank\n" +
      "• Always left join actual data onto the shell after the Cross Join",
  },
  // ════════════════════════════════════════════════════════════
// SELF JOIN
// Paste inside joinsData array, after cross-join, before ];
// ════════════════════════════════════════════════════════════
  {
    id: "self-join",
    category: "Merge Joins",
    title: "Self Join",

    overview:
      "A Self Join joins a dataset to itself. " +
      "The same dataset is referenced twice — " +
      "one acting as the left side and one as the right side of the join. " +
      "This allows you to compare rows within the same dataset against each other. " +
      "In SAS, this can be achieved using the DATA step by splitting the dataset into two subsets first, " +
      "or more concisely using PROC SQL with aliases. " +
      "In R, the same dataset is simply passed twice into any join function.",

    behavior:
      "In SAS, a Self Join can be performed in two ways. " +
      "Using the DATA step — the dataset is split into two subsets first, sorted, and then merged together. " +
      "Using PROC SQL — the same dataset is referenced twice with different aliases, which is more concise. " +
      "In R, a Self Join is performed by passing the same dataset as both arguments in any dplyr join function. " +
      "The suffix argument distinguishes columns from each copy. No prior sorting is required in R.",

    sas: `/* DATA step approach — split into two copies then merge */
data BASE NONBASE;
  set ADLB;
  if ABLFL = "Y" then output BASE;
  else output NONBASE;
run;

proc sort data=BASE;    by USUBJID LBTESTCD; run;
proc sort data=NONBASE; by USUBJID LBTESTCD; run;

data ADLB_FINAL;
  merge NONBASE(in=a)
        BASE(in=b keep=USUBJID LBTESTCD AVAL
             rename=(AVAL=BASE));
  by USUBJID LBTESTCD;
  if a;
  CHG = AVAL - BASE;
run;

/* PROC SQL approach — same result, fewer steps */
proc sql;
  create table ADLB_FINAL as
  select a.USUBJID,
         a.LBTESTCD,
         a.AVISIT,
         a.AVAL,
         b.AVAL as BASE,
         a.AVAL - b.AVAL as CHG
  from ADLB a
  inner join ADLB b
  on  a.USUBJID  = b.USUBJID
  and a.LBTESTCD = b.LBTESTCD
  where a.ABLFL ne "Y"
  and   b.ABLFL   = "Y";
quit;`,

    r: `library(dplyr)

ADLB_FINAL <- inner_join(
  ADLB %>% filter(ABLFL != "Y"),
  ADLB %>% filter(ABLFL == "Y") %>%
    select(USUBJID, LBTESTCD, BASE = AVAL),
  by = c("USUBJID", "LBTESTCD")
) %>%
  mutate(CHG = AVAL - BASE)`,

    details:
      "Self Joins are used when the answer to a question requires comparing rows within the same dataset. " +
      "In ADaM programming, two very common Self Join use cases are: " +
      "deriving BASE and CHG by joining a dataset to itself on USUBJID and PARAMCD or LBTESTCD, " +
      "and flagging post-baseline values that are worse than the baseline value for safety monitoring. " +
      "In SAS, the DATA step approach splits the dataset into two subsets physically. " +
      "PROC SQL is more concise — it uses aliases without creating physical copies. " +
      "In R, the same dataset is filtered into two versions and joined directly.",

    // ── Example 1 ──────────────────────────────────────────
    example1Title: "Example 1 — Deriving BASE and CHG in ADLB using Self Join",
    example1Desc:
      "ADLB contains both baseline (ABLFL = Y) and post-baseline lab records for each subject and test. " +
      "A Self Join on USUBJID and LBTESTCD brings the baseline AVAL across to every post-baseline row " +
      "as BASE — allowing CHG to be derived directly as AVAL - BASE. " +
      "Both the DATA step and PROC SQL approaches are shown for SAS.",

    example1Input: `
── Input Dataset: ADLB ────────────────────────────

USUBJID       LBTESTCD    AVISIT        ABLFL    AVAL
CDISC001      ALT         Baseline      Y        25
CDISC001      ALT         Week 4                 30
CDISC001      ALT         Week 8                 28
CDISC001      CREAT       Baseline      Y        0.9
CDISC001      CREAT       Week 4                 1.0
CDISC001      CREAT       Week 8                 1.1
CDISC002      ALT         Baseline      Y        22
CDISC002      ALT         Week 4                 45
CDISC002      ALT         Week 8                 38
CDISC002      CREAT       Baseline      Y        1.0
CDISC002      CREAT       Week 4                 1.2
CDISC002      CREAT       Week 8                 1.5
`,

    exampleSAS: `/* ── DATA Step approach ── */

/* Step 1 — Split into baseline and non-baseline */
data ADLB_BASE ADLB_NONBASE;
  set ADLB;
  if ABLFL = "Y" then output ADLB_BASE;
  else output ADLB_NONBASE;
run;

/* Step 2 — Sort both subsets */
proc sort data=ADLB_BASE;    by USUBJID LBTESTCD; run;
proc sort data=ADLB_NONBASE; by USUBJID LBTESTCD; run;

/* Step 3 — Merge baseline value onto non-baseline rows */
data ADLB_FINAL;
  merge ADLB_NONBASE(in=a)
        ADLB_BASE(in=b
                  keep=USUBJID LBTESTCD AVAL
                  rename=(AVAL=BASE));
  by USUBJID LBTESTCD;
  if a;
  CHG = AVAL - BASE;
run;


/* ── PROC SQL approach — same result, fewer steps ── */
proc sql;
  create table ADLB_FINAL as
  select a.USUBJID,
         a.LBTESTCD,
         a.AVISIT,
         a.AVAL,
         b.AVAL         as BASE,
         a.AVAL - b.AVAL as CHG
  from ADLB a
  inner join ADLB b
  on  a.USUBJID  = b.USUBJID
  and a.LBTESTCD = b.LBTESTCD
  where a.ABLFL ne "Y"
  and   b.ABLFL   = "Y"
  order by a.USUBJID, a.LBTESTCD, a.AVISIT;
quit;`,

    exampleR: `library(dplyr)

ADLB_FINAL <- inner_join(
  ADLB %>% filter(ABLFL != "Y"),
  ADLB %>% filter(ABLFL == "Y") %>%
    select(USUBJID, LBTESTCD, BASE = AVAL),
  by = c("USUBJID", "LBTESTCD")
) %>%
  mutate(CHG = AVAL - BASE) %>%
  select(USUBJID, LBTESTCD, AVISIT, AVAL, BASE, CHG)`,

    outputTable1: `
USUBJID       LBTESTCD    AVISIT      AVAL    BASE    CHG
CDISC001      ALT         Week 4      30      25      5
CDISC001      ALT         Week 8      28      25      3
CDISC001      CREAT       Week 4      1.0     0.9     0.1
CDISC001      CREAT       Week 8      1.1     0.9     0.2
CDISC002      ALT         Week 4      45      22      23
CDISC002      ALT         Week 8      38      22      16
CDISC002      CREAT       Week 4      1.2     1.0     0.2
CDISC002      CREAT       Week 8      1.5     1.0     0.5
`,

    outputNote1:
      "Baseline records (ABLFL = Y) are excluded from the output — only post-baseline rows are kept. " +
      "BASE is the baseline AVAL for that USUBJID and LBTESTCD, brought across via the Self Join. " +
      "CHG is derived as AVAL - BASE for every post-baseline record. " +
      "Both ALT and CREAT are handled in a single step because the join is by USUBJID and LBTESTCD. " +
      "Both DATA step and PROC SQL produce the same result in SAS. " +
      "The result is also the same in R.",

    // ── Example 2 ──────────────────────────────────────────
    example2Title: "Example 2 — Flagging Post-Baseline Lab Values Worse than Baseline",
    example2Desc:
      "After deriving BASE and CHG, a common safety monitoring requirement is to flag " +
      "post-baseline lab values that are worse than the baseline value. " +
      "For liver enzymes like ALT, a higher post-baseline value is worse. " +
      "A Self Join on USUBJID and LBTESTCD compares each post-baseline AVAL " +
      "against the baseline AVAL and flags records where AVAL > BASE.",

    example2Input: `
── Input Dataset: ADLB (same as Example 1) ────────

USUBJID       LBTESTCD    AVISIT        ABLFL    AVAL
CDISC001      ALT         Baseline      Y        25
CDISC001      ALT         Week 4                 30
CDISC001      ALT         Week 8                 28
CDISC002      ALT         Baseline      Y        22
CDISC002      ALT         Week 4                 45
CDISC002      ALT         Week 8                 38
CDISC003      ALT         Baseline      Y        30
CDISC003      ALT         Week 4                 18
CDISC003      ALT         Week 8                 20
`,

    example2SAS: `/* ── DATA Step approach ── */

/* Step 1 — Split into baseline and non-baseline */
data ADLB_BASE ADLB_NONBASE;
  set ADLB;
  if ABLFL = "Y" then output ADLB_BASE;
  else output ADLB_NONBASE;
run;

/* Step 2 — Sort both subsets */
proc sort data=ADLB_BASE;    by USUBJID LBTESTCD; run;
proc sort data=ADLB_NONBASE; by USUBJID LBTESTCD; run;

/* Step 3 — Merge and flag worse than baseline */
data ADLB_FLAG;
  merge ADLB_NONBASE(in=a)
        ADLB_BASE(in=b
                  keep=USUBJID LBTESTCD AVAL
                  rename=(AVAL=BASE));
  by USUBJID LBTESTCD;
  if a;
  CHG        = AVAL - BASE;
  WORSE_FL   = ifc(AVAL > BASE, "Y", "");
run;


/* ── PROC SQL approach — same result, fewer steps ── */
proc sql;
  create table ADLB_FLAG as
  select a.USUBJID,
         a.LBTESTCD,
         a.AVISIT,
         a.AVAL,
         b.AVAL          as BASE,
         a.AVAL - b.AVAL as CHG,
         ifc(a.AVAL > b.AVAL, "Y", "") as WORSE_FL
  from ADLB a
  inner join ADLB b
  on  a.USUBJID  = b.USUBJID
  and a.LBTESTCD = b.LBTESTCD
  where a.ABLFL ne "Y"
  and   b.ABLFL   = "Y"
  order by a.USUBJID, a.LBTESTCD, a.AVISIT;
quit;`,

    example2R: `library(dplyr)

ADLB_FLAG <- inner_join(
  ADLB %>% filter(ABLFL != "Y"),
  ADLB %>% filter(ABLFL == "Y") %>%
    select(USUBJID, LBTESTCD, BASE = AVAL),
  by = c("USUBJID", "LBTESTCD")
) %>%
  mutate(
    CHG      = AVAL - BASE,
    WORSE_FL = if_else(AVAL > BASE, "Y", "")
  ) %>%
  select(USUBJID, LBTESTCD, AVISIT, AVAL, BASE, CHG, WORSE_FL)`,

    outputTable2: `
USUBJID       LBTESTCD    AVISIT      AVAL    BASE    CHG    WORSE_FL
CDISC001      ALT         Week 4      30      25      5      Y
CDISC001      ALT         Week 8      28      25      3      Y
CDISC002      ALT         Week 4      45      22      23     Y
CDISC002      ALT         Week 8      38      22      16     Y
CDISC003      ALT         Week 4      18      30      -12
CDISC003      ALT         Week 8      20      30      -10
`,

    outputNote2:
      "CDISC001 and CDISC002 have WORSE_FL = Y at both Week 4 and Week 8 — " +
      "their ALT values increased above baseline. " +
      "CDISC003 improved from baseline at both visits — ALT decreased — so WORSE_FL is blank. " +
      "This flag is useful for safety listings and shift tables in clinical study reports. " +
      "Both DATA step and PROC SQL produce the same result in SAS. " +
      "The result is also the same in R.",

    // ── Conclusion ──────────────────────────────────────────
    conclusion:
      "Key Takeaway:\n" +
      "• Self Join joins a dataset to itself to compare rows within the same dataset\n" +
      "• In SAS DATA step — split into two subsets, rename variables, sort and merge by USUBJID and LBTESTCD\n" +
      "• In SAS PROC SQL — reference the same dataset twice with aliases; cleaner and fewer steps\n" +
      "• In R — filter the same dataset into two versions and pass both into any join function\n" +
      "• PROC SQL is preferred in SAS as it avoids creating physical copies of the dataset\n" +
      "• Common ADaM uses: deriving BASE and CHG, flagging values worse than baseline\n" +
      "• Always join on both USUBJID and LBTESTCD (or PARAMCD) to ensure correct subject-parameter pairing",
  },
  // ════════════════════════════════════════════════════════════
// SEMI JOIN
// Paste inside joinsData array, after anti-join, before symmetric-difference
// ════════════════════════════════════════════════════════════
  {
    id: "semi-join",
    category: "Merge Joins",
    title: "Semi Join",

    overview:
      "A Semi Join returns only the rows from the LEFT dataset that have a match in the RIGHT dataset. " +
      "It looks similar to an Inner Join — but the key difference is that " +
      "only columns from the LEFT dataset are returned. " +
      "No columns from the RIGHT dataset are included in the output, " +
      "and duplicate rows are not introduced even if the right dataset has multiple matches.",

    behavior:
      "In R, semi_join(x, y) is a dedicated dplyr function — it filters x to keep only rows " +
      "that have a match in y, returning only x columns. No prior sorting is required. " +
      "In SAS, there is no direct semi_join equivalent. " +
      "It is achieved using the MERGE statement with IN= options and a KEEP= option on the right dataset — " +
      "keeping only the BY variable from the right dataset ensures no right-side columns appear in the output. " +
      "Both datasets must be pre-sorted by the BY variable in SAS.",

    sas: `proc sort data=LEFT;  by SUBJID; run;
proc sort data=RIGHT; by SUBJID; run;

data RESULT;
  merge LEFT(in=a)
        RIGHT(in=b keep=SUBJID);
  by SUBJID;
  if a and b;
run;`,

    r: `library(dplyr)

RESULT <- semi_join(LEFT, RIGHT, by = "SUBJID")`,

    details:
      "Semi Join is useful when you want to filter one dataset based on the existence of matching records " +
      "in another dataset — without actually bringing any columns from the second dataset into the output. " +
      "This is different from an Inner Join which returns columns from both datasets. " +
      "Common clinical programming use cases include: " +
      "keeping only subjects from ADSL who have at least one AE record, " +
      "filtering DM to subjects who completed a specific visit, " +
      "or subsetting a lab dataset to only subjects who are in the analysis population. " +
      "In SAS, the KEEP= option on the right dataset is the key — " +
      "it ensures only the BY variable is read from the right side, " +
      "preventing any right-side columns from appearing in the output.",

    // ── Example 1 ──────────────────────────────────────────
    example1Title: "Example 1 — Filtering ADSL to Subjects with at Least One AE",
    example1Desc:
      "We want to keep only subjects from ADSL who have at least one Adverse Event record in AE. " +
      "A Semi Join filters ADSL using AE as the reference — " +
      "only ADSL columns are returned, and each subject appears only once " +
      "even if they have multiple AE records.",

    example1Input: `
── Input Dataset: ADSL (LEFT) — 4 subjects ────────

USUBJID       AGE    SEX    TRT01P
CDISC001      45     F      Drug A
CDISC002      52     M      Placebo
CDISC003      38     F      Drug A
CDISC004      61     M      Placebo


── Input Dataset: AE (RIGHT) ──────────────────────

USUBJID       AETERM            AESTDTC
CDISC001      HEADACHE          2023-01-05
CDISC001      NAUSEA            2023-01-10
CDISC002      DIZZINESS         2023-02-01
CDISC003      FATIGUE           2023-03-10
`,

    exampleSAS: `proc sort data=ADSL; by USUBJID; run;
proc sort data=AE;   by USUBJID; run;

data ADSL_WITH_AE;
  merge ADSL(in=a)
        AE(in=b keep=USUBJID);
  by USUBJID;
  if a and b;
run;`,

    exampleR: `library(dplyr)

ADSL_WITH_AE <- semi_join(ADSL, AE, by = "USUBJID")`,

    outputTable1: `
USUBJID       AGE    SEX    TRT01P
CDISC001      45     F      Drug A
CDISC002      52     M      Placebo
CDISC003      38     F      Drug A
`,

    outputNote1:
      "Only subjects from ADSL who have at least one AE record are returned. " +
      "CDISC004 exists in ADSL but has no AE records — it is excluded from the output. " +
      "CDISC001 has two AE records (HEADACHE and NAUSEA) — but appears only once in the output " +
      "because Semi Join does not multiply rows unlike Inner Join. " +
      "Only ADSL columns are returned — no AE columns appear in the output. " +
      "The result is the same in both SAS and R.",

    // ── Example 2 ──────────────────════════════════════════
    example2Title: "Example 2 — Semi Join vs Inner Join: Key Difference",
    example2Desc:
      "This example highlights the key difference between Semi Join and Inner Join. " +
      "When the right dataset has multiple records per subject, " +
      "an Inner Join multiplies the rows from the left dataset — " +
      "one output row for each match. " +
      "A Semi Join always returns exactly one row per subject from the left dataset " +
      "regardless of how many matches exist in the right dataset.",

    example2Input: `
── Input Dataset: ADSL (LEFT) — 2 subjects ────────

USUBJID       AGE    SEX
CDISC001      45     F
CDISC002      52     M


── Input Dataset: AE (RIGHT) ──────────────────────

USUBJID       AETERM
CDISC001      HEADACHE
CDISC001      NAUSEA
CDISC001      DIZZINESS
CDISC002      FATIGUE
`,

    example2SAS: `/* Semi Join — one row per subject, only ADSL columns */
proc sort data=ADSL; by USUBJID; run;
proc sort data=AE;   by USUBJID; run;

data SEMI_RESULT;
  merge ADSL(in=a)
        AE(in=b keep=USUBJID);
  by USUBJID;
  if a and b;
run;

/* Inner Join — multiplies rows, includes AE columns */
proc sql;
  create table INNER_RESULT as
  select a.*, b.AETERM
  from ADSL a
  inner join AE b
  on a.USUBJID = b.USUBJID;
quit;`,

    example2R: `library(dplyr)

# Semi Join — one row per subject, only ADSL columns
SEMI_RESULT <- semi_join(ADSL, AE, by = "USUBJID")

# Inner Join — multiplies rows, includes AE columns
INNER_RESULT <- inner_join(ADSL, AE, by = "USUBJID")`,

    outputTable2: `
── Semi Join Output — one row per subject ─────────

USUBJID       AGE    SEX
CDISC001      45     F
CDISC002      52     M


── Inner Join Output — rows multiplied ────────────

USUBJID       AGE    SEX    AETERM
CDISC001      45     F      HEADACHE
CDISC001      45     F      NAUSEA
CDISC001      45     F      DIZZINESS
CDISC002      52     M      FATIGUE
`,

    outputNote2:
      "Semi Join returns 2 rows — one per subject from ADSL — with only ADSL columns. " +
      "Inner Join returns 4 rows — CDISC001 appears 3 times because it has 3 AE records — " +
      "and includes the AETERM column from AE. " +
      "Use Semi Join when you only need to filter the left dataset based on matches — " +
      "not bring in any data from the right dataset. " +
      "Use Inner Join when you need columns from both datasets in the output. " +
      "The Semi Join result is the same in both SAS and R.",

    // ── Conclusion ──────────────────────────────────────────
    conclusion:
      "Key Takeaway:\n" +
      "• Semi Join returns rows from LEFT that have a match in RIGHT — only LEFT columns are returned\n" +
      "• Unlike Inner Join — no columns from the right dataset appear in the output\n" +
      "• Unlike Inner Join — rows are never multiplied even if RIGHT has multiple matches\n" +
      "• In R — semi_join(x, y) is a dedicated dplyr function; no prior sorting needed\n" +
      "• In SAS — use MERGE with IF A AND B and KEEP= only the BY variable from the right dataset\n" +
      "• Use Semi Join to filter a dataset based on existence of matches — not to bring in new columns\n" +
      "• Common clinical uses: filtering ADSL to subjects with AEs, visits, or lab records",
  },
  // ════════════════════════════════════════════════════════════
// NON-EQUI JOIN
// Paste inside joinsData array, after self-join, before ];
// ════════════════════════════════════════════════════════════
  {
    id: "non-equi-join",
    category: "Merge Joins",
    title: "Non-Equi Join",

    overview:
      "A Non-Equi Join joins two datasets using a condition other than equality. " +
      "Instead of matching on exact key values, rows are joined based on range conditions " +
      "such as greater than, less than, or between. " +
      "This allows you to check whether a value or date from one dataset " +
      "falls within a range defined in another dataset.",

    behavior:
      "In SAS, a Non-Equi Join can only be performed using PROC SQL — " +
      "the DATA step MERGE only supports equality-based joins on BY variables. " +
      "PROC SQL allows any comparison operator (=, <, >, <=, >=, BETWEEN) in the ON or WHERE clause. " +
      "In R, Non-Equi Joins are performed using dplyr's join_by() function " +
      "which supports inequality conditions such as between(), >=, and <=. " +
      "No prior sorting is required in R.",

    sas: `/* Non-Equi Join — date falls within a range */
proc sql;
  create table RESULT as
  select a.*,
         b.*
  from LEFT a
  inner join RIGHT b
  on  a.USUBJID  = b.USUBJID
  and a.DATE between b.START_DATE and b.END_DATE;
quit;`,

    r: `library(dplyr)

RESULT <- inner_join(
  LEFT, RIGHT,
  by = join_by(
    USUBJID,
    between(DATE, START_DATE, END_DATE)
  )
)`,

    details:
      "Non-Equi Joins are essential in clinical programming for date-range based linkage between datasets. " +
      "Common use cases include checking whether an AE occurred during a concomitant medication period, " +
      "whether a lab value falls outside a reference range, " +
      "or whether a visit date falls within a subject's treatment window. " +
      "In SAS, PROC SQL handles these efficiently with BETWEEN or comparison operators in the WHERE clause. " +
      "In R, join_by() with between() or inequality operators provides a clean readable syntax. " +
      "Non-Equi Joins can produce many-to-many results if a subject has multiple overlapping ranges — " +
      "always review the output row count carefully.",

    // ── Example 1 ──────────────────────────────────────────
    example1Title: "Example 1 — AE Date Falling Within Concomitant Medication Period",
    example1Desc:
      "We want to identify AEs that occurred while the subject was taking a concomitant medication. " +
      "AE and CM are joined on USUBJID — but only where AESTDTC falls between CMSTDTC and CMENDTC. " +
      "This is a Non-Equi Join because the condition is a date range, not an exact match.",

    example1Input: `
── Input Dataset: AE ──────────────────────────────

USUBJID       AESEQ    AETERM          AESTDTC
CDISC001      1        HEADACHE        2023-02-10
CDISC001      2        NAUSEA          2023-04-05
CDISC002      1        DIZZINESS       2023-03-15
CDISC002      2        FATIGUE         2023-05-20
CDISC003      1        RASH            2023-01-10


── Input Dataset: CM ──────────────────────────────

USUBJID       CMTRT           CMSTDTC      CMENDTC
CDISC001      PARACETAMOL     2023-02-01   2023-02-28
CDISC001      IBUPROFEN       2023-04-01   2023-04-30
CDISC002      METFORMIN       2023-03-01   2023-03-31
CDISC003      ASPIRIN         2023-02-01   2023-02-28
`,

    exampleSAS: `proc sql;
  create table AE_DURING_CM as
  select a.USUBJID,
         a.AETERM,
         a.AESTDTC,
         b.CMTRT,
         b.CMSTDTC,
         b.CMENDTC
  from AE a
  inner join CM b
  on  a.USUBJID = b.USUBJID
  and input(a.AESTDTC, yymmdd10.)
      between input(b.CMSTDTC, yymmdd10.)
          and input(b.CMENDTC, yymmdd10.)
  order by a.USUBJID, a.AESTDTC;
quit;`,

    exampleR: `library(dplyr)

# Convert dates first
AE <- AE %>% mutate(AESTDTC = as.Date(AESTDTC))
CM <- CM %>% mutate(across(c(CMSTDTC, CMENDTC), as.Date))

AE_DURING_CM <- inner_join(
  AE, CM,
  by = join_by(
    USUBJID,
    between(AESTDTC, CMSTDTC, CMENDTC)
  )
) %>%
  select(USUBJID, AETERM, AESTDTC,
         CMTRT, CMSTDTC, CMENDTC)`,

    outputTable1: `
USUBJID       AETERM       AESTDTC      CMTRT           CMSTDTC      CMENDTC
CDISC001      HEADACHE     2023-02-10   PARACETAMOL     2023-02-01   2023-02-28
CDISC001      NAUSEA       2023-04-05   IBUPROFEN       2023-04-01   2023-04-30
CDISC002      DIZZINESS    2023-03-15   METFORMIN       2023-03-01   2023-03-31
`,

    outputNote1:
      "CDISC001 HEADACHE occurred on 2023-02-10 — which falls within the PARACETAMOL period (Feb 01-28). " +
      "CDISC001 NAUSEA occurred on 2023-04-05 — which falls within the IBUPROFEN period (Apr 01-30). " +
      "CDISC002 DIZZINESS occurred on 2023-03-15 — which falls within the METFORMIN period (Mar 01-31). " +
      "CDISC002 FATIGUE occurred on 2023-05-20 — no CM period covers this date — excluded. " +
      "CDISC003 RASH occurred on 2023-01-10 — before the ASPIRIN period (Feb 01-28) — excluded. " +
      "The result is the same in both SAS and R.",

    // ── Example 2 ──────────────────────────────────────────
    example2Title: "Example 2 — Lab Values Outside Reference Range",
    example2Desc:
      "A reference range lookup table defines the normal low and high values for each lab test. " +
      "A Non-Equi Join between ADLB and the reference range table on LBTESTCD " +
      "flags records where AVAL is below the lower limit or above the upper limit of normal. " +
      "The join condition uses inequality operators instead of equality.",

    example2Input: `
── Input Dataset: ADLB ────────────────────────────

USUBJID       LBTESTCD    AVISIT      AVAL
CDISC001      ALT         Week 4      55
CDISC001      ALT         Week 8      28
CDISC001      CREAT       Week 4      0.6
CDISC001      CREAT       Week 8      1.4
CDISC002      ALT         Week 4      22
CDISC002      ALT         Week 8      80
CDISC002      CREAT       Week 4      1.0
CDISC002      CREAT       Week 8      0.5


── Input Dataset: REFRANGE (reference ranges) ─────

LBTESTCD    LBORNRLO    LBORNRHI
ALT         7           40
CREAT       0.7         1.2
`,

    example2SAS: `proc sql;
  create table ADLB_ABNORMAL as
  select a.USUBJID,
         a.LBTESTCD,
         a.AVISIT,
         a.AVAL,
         b.LBORNRLO,
         b.LBORNRHI,
         case
           when a.AVAL < b.LBORNRLO then "LOW"
           when a.AVAL > b.LBORNRHI then "HIGH"
         end as ABNFL
  from ADLB a
  inner join REFRANGE b
  on  a.LBTESTCD = b.LBTESTCD
  and (a.AVAL < b.LBORNRLO or a.AVAL > b.LBORNRHI)
  order by a.USUBJID, a.LBTESTCD, a.AVISIT;
quit;`,

  example2R: `library(dplyr)

ADLB_ABNORMAL <- inner_join(
  ADLB, REFRANGE,
  by = join_by(
    LBTESTCD,
    AVAL < LBORNRLO | AVAL > LBORNRHI
  )
) %>%
  mutate(
    ABNFL = case_when(
      AVAL < LBORNRLO ~ "LOW",
      AVAL > LBORNRHI ~ "HIGH"
    )
  ) %>%
  select(USUBJID, LBTESTCD, AVISIT,
         AVAL, LBORNRLO, LBORNRHI, ABNFL)`,

    outputTable2: `
USUBJID       LBTESTCD    AVISIT      AVAL    LBORNRLO    LBORNRHI    ABNFL
CDISC001      ALT         Week 4      55      7           40          HIGH
CDISC001      CREAT       Week 4      0.6     0.7         1.2         LOW
CDISC001      CREAT       Week 8      1.4     0.7         1.2         HIGH
CDISC002      ALT         Week 8      80      7           40          HIGH
CDISC002      CREAT       Week 8      0.5     0.7         1.2         LOW
`,

    outputNote2:
      "Only records where AVAL falls outside the reference range are returned. " +
      "CDISC001 ALT Week 4 is HIGH (55 > 40). " +
      "CDISC001 CREAT Week 4 is LOW (0.6 < 0.7) and Week 8 is HIGH (1.4 > 1.2). " +
      "CDISC002 ALT Week 8 is HIGH (80 > 40). " +
      "CDISC002 CREAT Week 8 is LOW (0.5 < 0.7). " +
      "Normal records (CDISC001 ALT Week 8, CDISC002 ALT Week 4, CDISC002 CREAT Week 4) are excluded. " +
      "The result is the same in both SAS and R.",

    // ── Conclusion ──────────────────────────────────────────
    conclusion:
      "Key Takeaway:\n" +
      "• Non-Equi Join joins datasets using range or inequality conditions — not just equality\n" +
      "• In SAS — only possible via PROC SQL; DATA step MERGE supports equality joins only\n" +
      "• In R — use join_by() with between(), >=, <= or other inequality operators\n" +
      "• Common clinical uses: AE during CM period, lab values outside reference range, visit within treatment window\n" +
      "• Always convert character dates to numeric in SAS before using BETWEEN in PROC SQL\n" +
      "• In R — always convert character dates to Date class using as.Date() before joining\n" +
      "• Non-Equi Joins can produce many-to-many results — always check output row counts carefully",
  },
 // ════════════════════════════════════════════════════════════
// ROLLING JOIN
// Paste inside joinsData array, after non-equi-join, before ];
// ════════════════════════════════════════════════════════════
  {
    id: "rolling-join",
    category: "Merge Joins",
    title: "Rolling Join",

    overview:
      "A Rolling Join finds the nearest matching record rather than requiring an exact match. " +
      "When joining on a date or numeric value, it looks for the closest value in the right dataset " +
      "relative to each row in the left dataset — either the nearest prior record (backward roll) " +
      "or the nearest following record (forward roll). " +
      "This is useful when exact date matches are unlikely but you still need to link records across datasets.",

    behavior:
      "In SAS, a Rolling Join is achieved in two steps. " +
      "First, PROC SQL filters all candidate records from the right dataset that satisfy the date condition. " +
      "Then a DATA step with LAST. picks only the closest record per group from the filtered result. " +
      "This two-step approach ensures the date condition is respected before selecting the nearest record. " +
      "In R, Rolling Joins are supported natively using join_by() with closest() from dplyr 1.1.0 — " +
      "this handles both the filtering and nearest-record selection in a single step. " +
      "No prior sorting is required in R.",

    sas: `/* Step 1 — PROC SQL to filter all valid candidates */
proc sql;
  create table ALL_CANDIDATES as
  select a.USUBJID,
         a.LEFT_DATE,
         b.RIGHT_DATE,
         b.VALUE
  from LEFT a
  inner join RIGHT b
  on  a.USUBJID   = b.USUBJID
  and input(b.RIGHT_DATE, yymmdd10.)
      <= input(a.LEFT_DATE, yymmdd10.)
  order by USUBJID, LEFT_DATE, RIGHT_DATE;
quit;

/* Step 2 — LAST. to keep only the closest prior record */
data RESULT;
  set ALL_CANDIDATES;
  by USUBJID LEFT_DATE RIGHT_DATE;
  if last.LEFT_DATE then output;
run;`,

    r: `library(dplyr)

# Rolling Join — nearest prior record (backward roll)
RESULT <- left_join(
  LEFT, RIGHT,
  by = join_by(USUBJID, closest(LEFT_DATE >= RIGHT_DATE))
)`,

    details:
      "Rolling Joins are essential in clinical programming when linking records across datasets " +
      "where exact date matches are not guaranteed. " +
      "The key principle in SAS is the two-step approach — " +
      "PROC SQL first filters all candidate records satisfying the date condition, " +
      "then LAST. in the DATA step picks only the closest one per group. " +
      "Doing LAST. without the PROC SQL filter first would incorrectly bring the overall " +
      "most recent record regardless of the left dataset date. " +
      "In R, join_by(closest()) handles both steps in one clean call. " +
      "Always check for subjects with no prior record — they will have missing values in the output.",

    // ── Example 1 ──────────────────────────────────────────
    example1Title: "Example 1 — Most Recent Lab Value Before an AE Date",
    example1Desc:
      "When an AE occurs, we want to find the most recent lab result available " +
      "at the time of the AE for each subject and lab test. " +
      "The lab result must have been collected on or before the AE start date. " +
      "In SAS, PROC SQL first filters all labs on or before each AE date, " +
      "then LAST.LBTESTCD picks the closest prior lab per subject, test and AE. " +
      "In R, join_by(closest()) handles this in one step.",

    example1Input: `
── Input Dataset: AE ──────────────────────────────

USUBJID       AETERM          AESTDTC
CDISC001      HEADACHE        2023-03-15
CDISC001      NAUSEA          2023-05-20
CDISC002      FATIGUE         2023-04-10
CDISC003      DIZZINESS       2023-02-28


── Input Dataset: LB (lab results) ────────────────

USUBJID       LBTESTCD    LBDTC        AVAL
CDISC001      ALT         2023-01-10   25
CDISC001      ALT         2023-03-01   32
CDISC001      ALT         2023-05-01   45
CDISC002      ALT         2023-04-05   28
CDISC002      ALT         2023-06-01   35
CDISC003      ALT         2023-03-10   22
`,

    exampleSAS: `/* Step 1 — PROC SQL: get all labs on or before each AE date */
proc sql;
  create table AE_LB_ALL as
  select a.USUBJID,
         a.AETERM,
         a.AESTDTC,
         b.LBTESTCD,
         b.LBDTC,
         b.AVAL
  from AE a
  inner join LB b
  on  a.USUBJID  = b.USUBJID
  and input(b.LBDTC,    yymmdd10.)
      <= input(a.AESTDTC, yymmdd10.)
  order by USUBJID, AESTDTC, LBTESTCD, LBDTC;
quit;

/* Step 2 — LAST. to keep only the closest prior lab */
data AE_WITH_LAB;
  set AE_LB_ALL;
  by USUBJID AESTDTC LBTESTCD LBDTC;
  if last.LBTESTCD then output;
  rename AVAL = RECENT_LAB;
run;`,

    exampleR: `library(dplyr)

# Convert dates
AE <- AE %>% mutate(AESTDTC = as.Date(AESTDTC))
LB <- LB %>% mutate(LBDTC   = as.Date(LBDTC))

AE_WITH_LAB <- left_join(
  AE, LB,
  by = join_by(
    USUBJID,
    closest(AESTDTC >= LBDTC)
  )
) %>%
  rename(RECENT_LAB = AVAL) %>%
  select(USUBJID, AETERM, AESTDTC,
         LBTESTCD, LBDTC, RECENT_LAB)`,

    outputTable1: `
USUBJID       AETERM       AESTDTC      LBTESTCD    LBDTC        RECENT_LAB
CDISC001      HEADACHE     2023-03-15   ALT         2023-03-01   32
CDISC001      NAUSEA       2023-05-20   ALT         2023-05-01   45
CDISC002      FATIGUE      2023-04-10   ALT         2023-04-05   28
CDISC003      DIZZINESS    2023-02-28   ALT         .            .
`,

    outputNote1:
      "CDISC001 HEADACHE on 2023-03-15 — PROC SQL returns labs on 2023-01-10 and 2023-03-01. " +
      "LAST. picks 2023-03-01 (AVAL=32) as the closest prior lab. " +
      "The lab on 2023-05-01 is after the AE date and is excluded by PROC SQL. " +
      "CDISC001 NAUSEA on 2023-05-20 — PROC SQL returns labs on 2023-01-10, 2023-03-01 and 2023-05-01. " +
      "LAST. picks 2023-05-01 (AVAL=45) as the closest prior lab. " +
      "CDISC002 FATIGUE on 2023-04-10 — PROC SQL returns only 2023-04-05 (AVAL=28). " +
      "The lab on 2023-06-01 is after the AE date and is excluded. " +
      "CDISC003 DIZZINESS on 2023-02-28 — the only lab (2023-03-10) is after the AE date — " +
      "PROC SQL returns no rows so missing values appear in the output. " +
      "The result is the same in both SAS and R.",

    // ── Example 2 ──────────────────────────────────────────
    example2Title: "Example 2 — Nearest Actual Visit to a Target Date",
    example2Desc:
      "In clinical trials, visits are planned on target dates but the actual visit date may differ. " +
      "A Rolling Join finds the nearest actual visit on or before each planned target date for each subject. " +
      "In SAS, PROC SQL first filters all actual visits on or before each target date, " +
      "then LAST.PLANNED_VISIT picks the closest prior actual visit per subject and planned visit. " +
      "In R, join_by(closest()) matches each target date to the nearest prior actual visit.",

    example2Input: `
── Input Dataset: TARGETVISIT (planned schedule) ──

USUBJID       PLANNED_VISIT    TARGET_DT
CDISC001      Week 4           2023-02-05
CDISC001      Week 8           2023-03-05
CDISC002      Week 4           2023-02-05
CDISC002      Week 8           2023-03-05


── Input Dataset: VS (actual visits collected) ────

USUBJID       ACTUAL_DT
CDISC001      2023-02-03
CDISC001      2023-03-04
CDISC002      2023-01-30
CDISC002      2023-02-28
CDISC002      2023-03-10
`,

    example2SAS: `/* Step 1 — PROC SQL: get all actual visits on or before each target date */
proc sql;
  create table TV_VS_ALL as
  select a.USUBJID,
         a.PLANNED_VISIT,
         a.TARGET_DT,
         b.ACTUAL_DT
  from TARGETVISIT a
  inner join VS b
  on  a.USUBJID = b.USUBJID
  and input(b.ACTUAL_DT, yymmdd10.)
      <= input(a.TARGET_DT, yymmdd10.)
  order by USUBJID, PLANNED_VISIT, TARGET_DT, ACTUAL_DT;
quit;

/* Step 2 — LAST. to keep only the closest prior actual visit */
data VISIT_MATCH;
  set TV_VS_ALL;
  by USUBJID PLANNED_VISIT TARGET_DT ACTUAL_DT;
  if last.PLANNED_VISIT then output;
  DIFF_DAYS = abs(input(TARGET_DT, yymmdd10.) -
                  input(ACTUAL_DT, yymmdd10.));
run;`,

    example2R: `library(dplyr)

# Convert dates
TARGETVISIT <- TARGETVISIT %>%
  mutate(TARGET_DT = as.Date(TARGET_DT))
VS <- VS %>%
  mutate(ACTUAL_DT = as.Date(ACTUAL_DT))

VISIT_MATCH <- left_join(
  TARGETVISIT, VS,
  by = join_by(
    USUBJID,
    closest(TARGET_DT >= ACTUAL_DT)
  )
) %>%
  mutate(DIFF_DAYS = as.numeric(
    abs(TARGET_DT - ACTUAL_DT))) %>%
  select(USUBJID, PLANNED_VISIT,
         TARGET_DT, ACTUAL_DT, DIFF_DAYS)`,

    outputTable2: `
USUBJID       PLANNED_VISIT    TARGET_DT      ACTUAL_DT      DIFF_DAYS
CDISC001      Week 4           2023-02-05     2023-02-03     2
CDISC001      Week 8           2023-03-05     2023-03-04     1
CDISC002      Week 4           2023-02-05     2023-01-30     6
CDISC002      Week 8           2023-03-05     2023-02-28     5
`,

    outputNote2:
      "CDISC001 Week 4 target 2023-02-05 — PROC SQL returns 2023-02-03 as the only prior visit. " +
      "LAST. picks 2023-02-03 (2 days before target). " +
      "CDISC001 Week 8 target 2023-03-05 — PROC SQL returns 2023-02-03 and 2023-03-04. " +
      "LAST. picks 2023-03-04 as the closest prior visit (1 day before target). " +
      "CDISC002 Week 4 target 2023-02-05 — PROC SQL returns only 2023-01-30 as prior visit. " +
      "LAST. picks 2023-01-30 (6 days before target). " +
      "CDISC002 Week 8 target 2023-03-05 — PROC SQL returns 2023-01-30 and 2023-02-28. " +
      "LAST. picks 2023-02-28 as the closest prior visit (5 days before target). " +
      "Note: CDISC002 actual visit 2023-03-10 is after Week 8 target so it is excluded by PROC SQL. " +
      "The result is the same in both SAS and R.",

    // ── Conclusion ──────────────────────────────────────────
    conclusion:
      "Key Takeaway:\n" +
      "• Rolling Join finds the nearest matching record — not an exact match\n" +
      "• In SAS — always use a two-step approach:\n" +
      "    Step 1: PROC SQL to filter all candidates satisfying the date condition\n" +
      "    Step 2: DATA step with LAST. to pick only the closest record per group\n" +
      "• Never use LAST. alone without PROC SQL filter — it ignores the left dataset date condition\n" +
      "• In R — use join_by(closest()) from dplyr 1.1.0 for clean one-step rolling joins\n" +
      "• closest(x >= y) finds the nearest prior record — closest(x <= y) finds the nearest following record\n" +
      "• Always convert character dates — INPUT() in SAS, as.Date() in R\n" +
      "• Subjects with no prior record return missing values — always check output carefully\n" +
      "• Common clinical uses: most recent lab before AE, nearest visit to target date, closest prior dose",
  },
  
  ];