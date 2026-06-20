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
}
]