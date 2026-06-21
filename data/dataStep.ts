export type DataStepItem = {
  id: string;
  title: string;
  category: "Data Step";
  overview: string;
  behavior?: string;
  sas: string;
  r: string;
  details: string;

  example1Title?: string;
  example1Desc?: string;
  example1Input?: string;
  exampleSAS: string;
  exampleR: string;
  outputTable1?: string;
  outputNote1?: string;

  example2Title?: string;
  example2Desc?: string;
  example2Input?: string;
  example2SAS?: string;
  example2R?: string;
  outputTable2?: string;
  outputNote2?: string;

  example3Title?: string;
  example3Desc?: string;
  example3Input?: string;
  example3SAS?: string;
  example3R?: string;
  outputTable3?: string;
  outputNote3?: string;

  example4Title?: string;
  example4Desc?: string;
  example4Input?: string;
  example4SAS?: string;
  example4R?: string;
  outputTable4?: string;
  outputNote4?: string;

example5Title?: string;
example5Desc?: string;
example5Input?: string;
example5SAS?: string;
example5R?: string;
outputTable5?: string;
outputNote5?: string;

example6Title?: string;
example6Desc?: string;
example6Input?: string;
example6SAS?: string;
example6R?: string;
outputTable6?: string;
outputNote6?: string;

  watchOut?: string;

  conclusion?: string;
};
export const dataStepsData: DataStepItem[] = [
{
  id: "first-last",
  category: "Data Step",
  title: "FIRST. and LAST.",

  overview:
    "FIRST. and LAST. are automatic SAS variables created during BY-group processing. They are commonly used to derive baseline records, endpoint records, first occurrences, last occurrences, and subject-level summaries. In R, similar functionality is achieved using group_by(), slice(), row_number(), and summarise().",

  behavior:
    "FIRST.variable is 1 for the first observation in a BY group, while LAST.variable is 1 for the last observation in a BY group. In R, equivalent logic is typically implemented using group_by() combined with slice(1) or slice(n()).",

  sas: `proc sort data=ADLB;
  by USUBJID VISITNUM;
run;

data FIRST_REC;
  set ADLB;
  by USUBJID;
  if first.USUBJID;
run;`,

  r: `library(dplyr)

FIRST_REC <- ADLB %>%
  arrange(USUBJID, VISITNUM) %>%
  group_by(USUBJID) %>%
  slice(1) %>%
  ungroup()`,

  details:
    "FIRST. and LAST. processing is one of the most important Data Step concepts in clinical programming. It is frequently used to derive baseline values, endpoint values, first adverse events, last assessments, and subject-level summaries.",

  // ── Example 1 ─────────────────────────────
  example1Title: "Example 1 — Keep First Record Per Subject",

  example1Desc:
    "Keep only the first record for each subject.",

  example1Input: `
USUBJID    VISITNUM    AVAL
CDISC001   1           25
CDISC001   2           30
CDISC001   3           35
CDISC002   1           40
CDISC002   2           45
`,

  exampleSAS: `proc sort data=ADLB;
  by USUBJID VISITNUM;
run;

data FIRST_REC;
  set ADLB;
  by USUBJID;
  if first.USUBJID;
run;`,

  exampleR: `library(dplyr)

FIRST_REC <- ADLB %>%
  arrange(USUBJID, VISITNUM) %>%
  group_by(USUBJID) %>%
  slice(1) %>%
  ungroup()`,

  outputTable1: `
USUBJID    VISITNUM    AVAL
CDISC001   1           25
CDISC002   1           40
`,

  outputNote1:
    "FIRST.USUBJID identifies the first observation within each subject.",

  // ── Example 2 ─────────────────────────────
  example2Title: "Example 2 — Derive Baseline Record",

  example2Desc:
    "Keep the earliest record for each subject and laboratory parameter.",

  example2Input: `
USUBJID    LBTESTCD    VISITNUM    AVAL
CDISC001   ALT         1           25
CDISC001   ALT         2           30
CDISC001   AST         1           40
CDISC001   AST         2           42
CDISC002   ALT         1           35
CDISC002   ALT         2           50
`,

  example2SAS: `proc sort data=ADLB;
  by USUBJID LBTESTCD VISITNUM;
run;

data BASELINE;
  set ADLB;
  by USUBJID LBTESTCD;
  if first.LBTESTCD;
run;`,

  example2R: `library(dplyr)

BASELINE <- ADLB %>%
  arrange(USUBJID, LBTESTCD, VISITNUM) %>%
  group_by(USUBJID, LBTESTCD) %>%
  slice(1) %>%
  ungroup()`,

  outputTable2: `
USUBJID    LBTESTCD    VISITNUM    AVAL
CDISC001   ALT         1           25
CDISC001   AST         1           40
CDISC002   ALT         1           35
`,

  outputNote2:
    "A common clinical programming use case is deriving baseline records using FIRST. processing.",

  // ── Example 3 ─────────────────────────────
  example3Title: "Example 3 — Keep Last Record Per Subject",

  example3Desc:
    "Keep only the last record for each subject.",

  example3Input: `
USUBJID    VISITNUM    AVAL
CDISC001   1           25
CDISC001   2           30
CDISC001   3           35
CDISC002   1           40
CDISC002   2           45
`,

  example3SAS: `proc sort data=ADLB;
  by USUBJID VISITNUM;
run;

data LAST_REC;
  set ADLB;
  by USUBJID;
  if last.USUBJID;
run;`,

  example3R: `library(dplyr)

LAST_REC <- ADLB %>%
  arrange(USUBJID, VISITNUM) %>%
  group_by(USUBJID) %>%
  slice(n()) %>%
  ungroup()`,

  outputTable3: `
USUBJID    VISITNUM    AVAL
CDISC001   3           35
CDISC002   2           45
`,

  outputNote3:
    "LAST.USUBJID identifies the final observation within each subject.",

  // ── Example 4 ─────────────────────────────
  example4Title: "Example 4 — Derive Latest Assessment",

  example4Desc:
    "Keep the most recent record for each subject and laboratory parameter.",

  example4Input: `
USUBJID    LBTESTCD    VISITNUM    AVAL
CDISC001   ALT         1           25
CDISC001   ALT         2           30
CDISC001   ALT         3           35
CDISC001   AST         1           40
CDISC001   AST         2           42
CDISC002   ALT         1           35
CDISC002   ALT         2           50
`,

  example4SAS: `proc sort data=ADLB;
  by USUBJID LBTESTCD VISITNUM;
run;

data LAST_ASSESS;
  set ADLB;
  by USUBJID LBTESTCD;
  if last.LBTESTCD;
run;`,

  example4R: `library(dplyr)

LAST_ASSESS <- ADLB %>%
  arrange(USUBJID, LBTESTCD, VISITNUM) %>%
  group_by(USUBJID, LBTESTCD) %>%
  slice(n()) %>%
  ungroup()`,

  outputTable4: `
USUBJID    LBTESTCD    VISITNUM    AVAL
CDISC001   ALT         3           35
CDISC001   AST         2           42
CDISC002   ALT         2           50
`,

  outputNote4:
    "LAST. processing is commonly used to derive endpoint and latest assessment records.",

  // ── Example 5 ─────────────────────────────
example5Title: "Example 5 — Latest Record Using slice_tail()",

example5Desc:
  "Keep the last record within each subject using slice_tail().",

example5Input: `
USUBJID    VISITNUM    AVAL
CDISC001   1           25
CDISC001   2           30
CDISC001   3           35
CDISC002   1           40
CDISC002   2           45
`,

example5SAS: `proc sort data=ADLB;
  by USUBJID VISITNUM;
run;

data LAST_REC;
  set ADLB;
  by USUBJID;
  if last.USUBJID;
run;`,

example5R: `library(dplyr)

LAST_REC <- ADLB %>%
  arrange(USUBJID, VISITNUM) %>%
  group_by(USUBJID) %>%
  slice_tail(n = 1) %>%
  ungroup()`,

outputTable5: `
USUBJID    VISITNUM    AVAL
CDISC001   3           35
CDISC002   2           45
`,

outputNote5:
  "slice_tail(n = 1) returns the last observation within each group and is conceptually equivalent to LAST.variable processing in SAS.",

  conclusion:
    "Key Takeaway:\n" +
    "• FIRST.variable identifies the first observation in a BY group\n" +
    "• LAST.variable identifies the last observation in a BY group\n" +
    "• slice(1) and slice_head(n=x) in R corresponds to FIRST.\n" +
    "• slice(n()) and slice_tail(n=x) in R corresponds to LAST.\n" +
    "• Common clinical uses include baseline and endpoint derivations"
},

{
  id: "if-then-else",
  category: "Data Step",
  title: "IF-THEN/ELSE",

  overview:
    "IF-THEN/ELSE is used in SAS Data Step to create or modify variables based on conditions. In R, similar logic is implemented using if_else() and case_when().",

  behavior:
    "SAS evaluates IF conditions row by row and executes the first matching condition. In R, conditional logic is commonly implemented using mutate() together with if_else() or case_when().",

  sas: `data ADSL2;
  set ADSL;

  if AGE >= 65 then AGEFL = "Y";
  else AGEFL = "N";
run;`,

  r: `library(dplyr)

ADSL2 <- ADSL %>%
  mutate(
    AGEFL = if_else(
      AGE >= 65,
      "Y",
      "N"
    )
  )`,

  details:
    "Conditional processing is one of the most frequently used Data Step techniques in clinical programming. It is commonly used to derive analysis flags, treatment groups, responder status, and categorization variables.",

  example1Title: "Example 1 — Create AGE category Flag",

  example1Desc:
    "Create AGEFL based on age.",

  example1Input: `
USUBJID    AGE
CDISC001   45
CDISC002   70
CDISC003   62
CDISC004   35
`,

  exampleSAS: `data ADSL2;
  set ADSL;
  if AGE >= 65 then AGEFL = "Y";
  else AGEFL = "N";
run;`,

  exampleR: `library(dplyr)

ADSL2 <- ADSL %>%
  mutate(
    AGEFL = if_else(
      AGE >= 65,
      "Y",
      "N"
    )
  )`,

  outputTable1: `
USUBJID    AGE    AGEFL
CDISC001   45     N
CDISC002   70     Y
CDISC003   62     N
CDISC004   35     N
`,

  outputNote1:
    "if_else() is the closest equivalent to a simple IF-THEN/ELSE statement in SAS.",
  
  example2Title: "Example 2 — Multiple Conditions Using case_when()",

example2Desc:
  "Create age groups using multiple conditions.",

example2Input: `
USUBJID    AGE
CDISC001   35
CDISC002   45
CDISC003   62
CDISC004   70
`,

example2SAS: `data ADSL2;
  set ADSL;
  if AGE < 40 then AGEGR1 = "<40";
  else if AGE < 65 then AGEGR1 = "40-64";
  else AGEGR1 = ">=65";
run;`,

example2R: `library(dplyr)

ADSL2 <- ADSL %>%
  mutate(
    AGEGR1 = case_when(
      AGE < 40 ~ "<40",
      AGE < 65 ~ "40-64",
      TRUE ~ ">=65"
    )
  )`,

outputTable2: `
USUBJID    AGE    AGEGR1
CDISC001   35     <40
CDISC002   45     40-64
CDISC003   62     40-64
CDISC004   70     >=65
`,

outputNote2:
  "case_when() is the preferred R approach when multiple IF-THEN/ELSE conditions are required.",

example3Title: "Example 3 — IF-THEN/ELSE Using Admiral",

example3Desc:
  "Derive multiple variables using Admiral slice_derivation(), similar to SAS IF-THEN/ELSE DO blocks.",

example3Input: `
USUBJID    AGE
CDISC001   45
CDISC002   70
CDISC003   62
CDISC004   .
`,

example3SAS: `data ADSL2;
  set ADSL;

  if AGE >= 65 then do;
    ELDERLYFL = "Y";
    AGEGRP    = "65+";
    RISKFL    = "HIGH";
  end;
  else if AGE < 65 then do;
    ELDERLYFL = "N";
    AGEGRP    = "<65";
    RISKFL    = "LOW";
  end;
  else do;
    ELDERLYFL = "";
    AGEGRP    = "";
    RISKFL    = "";
  end;
run;`,

example3R: `library(admiral)

ADSL2 <- slice_derivation(
  ADSL,
  derivation = mutate,

  derivation_slice(
    filter = AGE >= 65,
    args = params(
      ELDERLYFL = "Y",
      AGEGRP    = "65+",
      RISKFL    = "HIGH"
    )
  ),

  derivation_slice(
    filter = AGE < 65,
    args = params(
      ELDERLYFL = "N",
      AGEGRP    = "<65",
      RISKFL    = "LOW"
    )
  ),

  derivation_slice(
    filter = is.na(AGE),
    args = params(
      ELDERLYFL = NA_character_,
      AGEGRP    = NA_character_,
      RISKFL    = NA_character_
    )
  )
) %>%
  arrange(USUBJID)`,

outputTable3: `
USUBJID    AGE    ELDERLYFL    AGEGRP    RISKFL
CDISC001   45     N            <65       LOW
CDISC002   70     Y            65+       HIGH
CDISC003   62     N            <65       LOW
CDISC004   .                             
`,

outputNote3:
  "Admiral slice_derivation() provides a SAS-like IF-THEN/ELSE framework in R and is particularly useful when deriving multiple variables from the same condition.",

example4Title: "Example 4 — IF-THEN/ELSE Using sasif",

example4Desc:
  "Use the sasif package to implement SAS-style IF-THEN/ELSE DO logic directly in R.",

example4Input: `
USUBJID    AGE
CDISC001   45
CDISC002   70
CDISC003   62
CDISC004   .
`,

example4SAS: `data ADSL2;
  set ADSL;

  if AGE >= 65 then do;
    ELDERLYFL = "Y";
    AGEGRP    = "65+";
    RISKFL    = "HIGH";
  end;
  else if AGE < 65 then do;
    ELDERLYFL = "N";
    AGEGRP    = "<65";
    RISKFL    = "LOW";
  end;
  else do;
    ELDERLYFL = "";
    AGEGRP    = "";
    RISKFL    = "";
  end;
run;`,

example4R: `library(sasif)

adsl_sasif <- data_step(
  dm,

  if_do(
    AGE >= 65,
    ELDERLYFL = "Y",
    AGEGRP    = "65+",
    RISKFL    = "HIGH"
  ),

  else_if_do(
    AGE < 65,
    ELDERLYFL = "N",
    AGEGRP    = "<65",
    RISKFL    = "LOW"
  ),

  else_do(
    ELDERLYFL = NA,
    AGEGRP    = NA,
    RISKFL    = NA
  )
) %>%
  arrange(USUBJID)`,

outputTable4: `
USUBJID    AGE    ELDERLYFL    AGEGRP    RISKFL
CDISC001   45     N            <65       LOW
CDISC002   70     Y            65+       HIGH
CDISC003   62     N            <65       LOW
CDISC004   .                             
`,

outputNote4:
  "sasif provides SAS-style IF-THEN/ELSE DO syntax in R. This approach can make R code easier to learn for programmers transitioning from SAS.",

example5Title: "Example 5 — Independent IF Conditions Using Admiral",

example5Desc:
  "Use restrict_derivation() to apply multiple independent IF conditions. Unlike IF-ELSE logic, each condition is evaluated separately.",

example5Input: `
USUBJID    AGE    SEX
CDISC001   70     M
CDISC002   45     M
CDISC003   72     F
CDISC004   35     F
`,

example5SAS: `data ADSL2;
  set ADSL;

  if AGE >= 65 then do;
    ELDERLYFL = "Y";
    CATN = 1;
  end;

  if SEX = "M" then do;
    MALEFL = "Y";
    SEXN = 1;
  end;

  if SEXN = 1 and
     AGE >= 40 and
     ELDERLYFL = "Y" then do;
    MLFL = "Y";
    ORD = 1;
  end;
run;`,

example5R: `library(admiral)

out_admiral <- dm %>%
  restrict_derivation(
    derivation = mutate,
    args = params(
      ELDERLYFL = "Y",
      CATN = 1
    ),
    filter = AGE >= 65
  ) %>%
  restrict_derivation(
    derivation = mutate,
    args = params(
      MALEFL = "Y",
      SEXN = 1
    ),
    filter = SEX == "M"
  ) %>%
  restrict_derivation(
    derivation = mutate,
    args = params(
      MLFL = "Y",
      ORD = 1
    ),
    filter = SEXN == 1 &
             AGE >= 40 &
             ELDERLYFL == "Y"
  )`,

outputTable5: `
USUBJID    AGE    SEX    ELDERLYFL    MALEFL    MLFL
CDISC001   70     M      Y            Y         Y
CDISC002   45     M                   Y
CDISC003   72     F      Y
CDISC004   35     F
`,

outputNote5:
  "restrict_derivation() behaves like multiple independent IF statements in SAS. Each condition is evaluated separately and can update variables created by previous derivations.",

example6Title: "Example 6 — Independent IF Conditions Using sasif",

example6Desc:
  "Use if_independent() to evaluate multiple standalone IF conditions similar to independent IF statements in SAS.",

example6Input: `
USUBJID    AGE    SEX
CDISC001   70     M
CDISC002   45     M
CDISC003   72     F
CDISC004   35     F
`,

example6SAS: `data ADSL2;
  set ADSL;

  if AGE >= 65 then do;
    ELDERLYFL = "Y";
    CATN = 1;
  end;

  if SEX = "M" then do;
    MALEFL = "Y";
    SEXN = 1;
  end;

  if SEXN = 1 and
     AGE >= 40 and
     ELDERLYFL = "Y" then do;
    MLFL = "Y";
    ORD = 1;
  end;
run;`,

example6R: `library(sasif)

adsl_sasif <- data_step(
  dm,

  if_independent(
    AGE >= 65,
    ELDERLYFL = "Y",
    CATN = 1
  ),

  if_independent(
    SEX == "M",
    MALEFL = "Y",
    SEXN = 1
  ),

  if_independent(
    SEXN == 1 &
    AGE >= 40 &
    ELDERLYFL == "Y",
    MLFL = "Y",
    ORD = 1
  )
) %>%
  arrange(USUBJID)`,

outputTable6: `
USUBJID    AGE    SEX    ELDERLYFL    MALEFL    MLFL
CDISC001   70     M      Y            Y         Y
CDISC002   45     M                   Y
CDISC003   72     F      Y
CDISC004   35     F
`,

outputNote6:
  "if_independent() evaluates each condition independently, similar to multiple standalone IF statements in SAS. Unlike IF-ELSE logic, all conditions are checked and can update variables created by previous conditions.",

conclusion:
  "Key Takeaway:\n" +
  "• IF-THEN/ELSE is used for conditional processing\n" +
  "• if_else() is the closest R equivalent for simple conditions\n" +
  "• case_when() is the preferred R approach for multiple conditions\n" +
  "• Admiral slice_derivation() supports SAS-style conditional derivations\n" +
  "• sasif provides SAS-like IF-THEN/ELSE DO syntax in R\n" +
  "• if_independent() in sasif is equivalent to multiple standalone IF statements in SAS\n" +
  "• Conditional logic is commonly used to derive analysis flags, categories, and responder status"
}
];